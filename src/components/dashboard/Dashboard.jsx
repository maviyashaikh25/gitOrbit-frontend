import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../common/Navbar";
import LeftSidebar from "../LeftSidebar";
import RightSidebar from "../RightSidebar";
import { Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import { formatTimeAgo } from "../../utils/timeUtils";
import { getLanguageColor } from "../../utils/languageUtils";

const Dashboard = () => {
    const [repositories, setRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestedRepositories, setSuggestedRepositories] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                const res = await axios.get("http://localhost:3000/repo/all");
                setRepositories(res.data);
                setSuggestedRepositories(res.data);
            } catch (err) {
                console.error("Error fetching repositories:", err);
            }
        };
        fetchRepositories();
    }, []);

    useEffect(() => {
        if (searchQuery === "") {
            setSuggestedRepositories(repositories);
        } else {
            const filtered = repositories.filter((repo) =>
                repo.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSuggestedRepositories(filtered);
        }
    }, [searchQuery, repositories]);

    const handleStar = async (repoId) => {
        try {
            await axios.put(`http://localhost:3000/repo/star/${repoId}`, {
                userID: currentUser
            });
            // Optimistic Update
            setRepositories(prev => prev.map(repo => {
                if (repo._id === repoId) {
                    const isStarred = repo.startgazers.some(id => id.toString() === currentUser);
                    return {
                        ...repo,
                        startgazers: isStarred 
                            ? repo.startgazers.filter(id => id.toString() !== currentUser)
                            : [...repo.startgazers, currentUser]
                    };
                }
                return repo;
            }));
        } catch (err) {
            console.error("Error starring repo:", err);
        }
    };

    // Note: To follow a user from the feed, we need to know if we are already following them.
    // The repo.owner object might not have the populated followers list updated in real-time or accessible easily if not populated deep enough.
    // However, repo.owner IS populated. Let's assume it has followers array.
    
    // We can allow following, but optimistically updating the UI for "Follow" on a Repo Card is tricky if multiple cards have same owner.
    // We should update ALL cards with that owner.

    // Also, we need to make sure we don't show Follow button for ourselves.

    const handleFollow = async (e, ownerId) => {
        e.preventDefault(); // Prevent navigation to repo/user if button inside link (but valid HTML shouldn't nest)
        try {
             // We need to check if we are following to decide toggle.
             // But for the button in the feed, we need the state. 
             // Let's assume we find the owner in the repo list and check their followers.
             
             const targetRepo = repositories.find(r => r.owner._id === ownerId);
             const isFollowing = targetRepo?.owner?.followers?.some(id => id.toString() === currentUser);

            if (isFollowing) {
                await axios.post(`http://localhost:3000/unfollow/${ownerId}`, { currentUserID: currentUser });
            } else {
                await axios.post(`http://localhost:3000/follow/${ownerId}`, { currentUserID: currentUser });
            }

            // Update all repos with this owner
            setRepositories(prev => prev.map(repo => {
                if (repo.owner._id === ownerId) {
                    const currentFollowers = repo.owner.followers || [];
                    return {
                        ...repo,
                        owner: {
                            ...repo.owner,
                            followers: isFollowing 
                                ? currentFollowers.filter(id => id.toString() !== currentUser)
                                : [...currentFollowers, currentUser]
                        }
                    };
                }
                return repo;
            }));

        } catch (err) {
            console.error("Error toggling follow:", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
            <Navbar />
            
            <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-4">
                {/* Sidebar (Left) */}
                <div className="hidden md:block lg:col-span-1">
                    <LeftSidebar />
                </div>

                {/* Main Content (Center) */}
                <div className="md:col-span-2 lg:col-span-2 p-4">
                    <div className="mb-4">
                         <input
                            type="text"
                            placeholder="Find a repository..."
                            className="w-full bg-[#0d1117] border border-[#30363d] text-white text-sm rounded-md px-3 py-2 focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] focus:outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        <h2 className="font-semibold text-xl text-white mb-4">Home</h2>
                        {suggestedRepositories.map((repo) => {
                            const isStarred = repo.startgazers && repo.startgazers.some(id => id.toString() === currentUser);
                            const isFollowing = repo.owner.followers && repo.owner.followers.some(id => id.toString() === currentUser);
                            const isMe = repo.owner._id === currentUser;

                            return (
                                <div key={repo._id} className="border border-[#30363d] rounded-md bg-[#0d1117] p-4 hover:border-[#8b949e] transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2 text-sm text-[#8b949e]">
                                             <img 
                                                src="https://avatars.githubusercontent.com/u/9919?v=4" 
                                                alt="avatar" 
                                                className="w-5 h-5 rounded-full border border-[#30363d]"
                                             />
                                             <Link to={`/user/${repo.owner._id}`} className="font-semibold text-[#c9d1d9] hover:underline hover:text-[#58a6ff]">
                                                 {repo.owner.username}
                                             </Link>
                                             <span>/</span>
                                             <div className="text-xs">
                                                 {formatTimeAgo(repo.updatedAt)}
                                             </div>
                                        </div>
                                        
                                        {!isMe && (
                                            <button 
                                                onClick={(e) => handleFollow(e, repo.owner._id)}
                                                className={`text-xs px-2 py-0.5 rounded-md border ${isFollowing ? 'border-transparent text-[#8b949e]' : 'border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d]'}`}
                                            >
                                                {isFollowing ? 'Following' : 'Follow'}
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Link to={`/repo/${repo._id}`} className="text-xl font-bold text-[#c9d1d9] hover:underline hover:text-[#58a6ff] mb-1 block">
                                                {repo.name}
                                            </Link>
                                            <p className="text-sm text-[#8b949e] mb-3 line-clamp-2">
                                                {repo.description || "No description provided."}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getLanguageColor(repo.language) }}></div>
                                                    <span>{repo.language}</span>
                                                </div>
                                                <div className="flex items-center gap-1 hover:text-[#58a6ff] cursor-pointer">
                                                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/></svg>
                                                    {repo.startgazers ? repo.startgazers.length : 0}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleStar(repo._id)}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium border transition-all ${isStarred ? 'bg-[#30363d] border-[#8b949e] text-[#e3b341]' : 'bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d] hover:border-[#8b949e]'}`}
                                        >
                                            <svg className={`w-4 h-4 ${isStarred ? 'text-[#e3b341]' : 'text-[#8b949e]'}`} fill={isStarred ? "currentColor" : "currentColor"} viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/></svg>
                                            {isStarred ? 'Starred' : 'Star'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {suggestedRepositories.length === 0 && (
                            <div className="p-8 text-center text-[#8b949e]">
                                No repositories found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar (Right) - Trending */}
                <div className="hidden lg:block lg:col-span-1">
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
