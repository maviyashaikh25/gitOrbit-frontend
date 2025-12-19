import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../common/Navbar";
import { useAuth } from "../../authContext";
import toast from "react-hot-toast";
import { formatTimeAgo } from "../../utils/timeUtils";
import { getLanguageColor } from "../../utils/languageUtils";

const Profile = () => {
    const { currentUser } = useAuth(); // logged in user ID
    const { id } = useParams(); // Profile user ID
    
    // If no ID in params (should shouldn't happen with updated routes, but safe fallback), use currentUser
    const profileId = id || currentUser;

    const [userDetails, setUserDetails] = useState(null);
    const [repos, setRepos] = useState([]);
    const [starredRepos, setStarredRepos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editBio, setEditBio] = useState("");
    const [activeTab, setActiveTab] = useState("repositories"); // repositories or stars
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
             if (!profileId) return;
             
             try {
                 // Fetch user details
                 const userRes = await axios.get(`http://localhost:3000/userProfile/${profileId}`);
                 setUserDetails(userRes.data);
                 setEditBio(userRes.data.bio || "");
                 if (userRes.data.starRepos) {
                     setStarredRepos(userRes.data.starRepos);
                 }
                 
                 // Check if current user is following this profile
                 if (userRes.data.followers && currentUser) {
                     setIsFollowing(userRes.data.followers.some(follower => follower._id === currentUser || follower === currentUser));
                 }

                 // Fetch user repos (Owned)
                 const reposRes = await axios.get(`http://localhost:3000/repo/user/${profileId}`);
                 if (reposRes.data && reposRes.data.repositories) {
                     setRepos(reposRes.data.repositories);
                 }
             } catch (err) {
                 console.error("Error fetching profile:", err);
             }
        };
        
        fetchProfileData();
    }, [profileId, currentUser]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:3000/updateProfile/${profileId}`, {
                email: userDetails.email, 
                bio: editBio
            });
            setUserDetails(res.data);
            setIsEditing(false);
            toast.success("Profile updated successfully");
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error("Failed to update profile");
        }
    };

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                 await axios.post(`http://localhost:3000/unfollow/${profileId}`, { currentUserID: currentUser });
                 setIsFollowing(false);
                 toast.success("Unfollowed user");
                 // Update local state for followers count
                 setUserDetails(prev => ({
                     ...prev,
                     followers: prev.followers.filter(f => f !== currentUser && f._id !== currentUser)
                 }));
            } else {
                 await axios.post(`http://localhost:3000/follow/${profileId}`, { currentUserID: currentUser });
                 setIsFollowing(true);
                 toast.success("Followed user");
                 // Update local state for followers count
                 setUserDetails(prev => ({
                     ...prev,
                     followers: [...(prev.followers || []), currentUser]
                 }));
            }
        } catch (err) {
             console.error("Error toggling follow:", err);
             toast.error("Failed to follow/unfollow");
        }
    };

    if (!userDetails) return <div className="min-h-screen bg-[#0d1117] flex justify-center items-center text-white">Loading...</div>;

    const isOwnProfile = currentUser === profileId;

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
            <Navbar />
            
            <div className="max-w-[1280px] mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
                {/* Left Sidebar - User Info */}
                <div className="w-full md:w-1/4">
                    <div className="mb-4">
                        <img 
                            src="https://avatars.githubusercontent.com/u/9919?v=4" // Placeholder
                            alt="Profile" 
                            className="w-64 h-64 rounded-full border border-[#30363d] mb-4"
                        />
                        <h1 className="text-2xl font-bold text-white mb-1">{userDetails.username}</h1>
                        <p className="text-[#8b949e] text-xl font-light mb-4">{userDetails.email}</p>
                        
                        {!isEditing ? (
                            <div className="mb-4">
                                <p className="mb-4 text-white">{userDetails.bio || "No bio yet."}</p>
                                {isOwnProfile ? (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="w-full bg-[#21262d] border border-[#30363d] text-[#c9d1d9] font-medium py-1.5 rounded-md hover:bg-[#30363d] transition-colors"
                                    >
                                        Edit profile
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleFollowToggle}
                                        className={`w-full border border-[#30363d] font-medium py-1.5 rounded-md transition-colors ${isFollowing ? 'bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] hover:border-[#8b949e]' : 'bg-[#238636] text-white hover:bg-[#2ea043] border-transparent'}`}
                                    >
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleUpdateProfile} className="mb-4">
                                <label className="block text-sm font-semibold mb-1">Bio</label>
                                <textarea 
                                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-sm text-white mb-2 focus:ring-2 focus:ring-[#58a6ff] outline-none"
                                    rows="3"
                                    value={editBio}
                                    onChange={(e) => setEditBio(e.target.value)}
                                ></textarea>
                                <div className="flex gap-2">
                                    <button 
                                        type="submit"
                                        className="flex-1 bg-[#238636] text-white py-1.5 rounded-md text-sm font-medium hover:bg-[#2ea043]"
                                    >
                                        Save
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 bg-[#21262d] border border-[#30363d] text-[#c9d1d9] py-1.5 rounded-md text-sm font-medium hover:bg-[#30363d]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                        
                        <div className="text-sm text-[#8b949e]">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M11.5 7a4.499 4.499 0 11-8.998 0A4.499 4.499 0 0111.5 7zM9 7a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" clipRule="evenodd" /></svg>
                                <span className="text-white font-bold">{userDetails.followers ? userDetails.followers.length : 0}</span> followers
                                <span>·</span>
                                <span className="text-white font-bold">{userDetails.followedUsers ? userDetails.followedUsers.length : 0}</span> following
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content - Tabs & Lists */}
                <div className="w-full md:w-3/4">
                    <div className="border-b border-[#30363d] mb-4 sticky top-0 bg-[#0d1117] z-10">
                        <nav className="flex gap-4">
                            <button 
                                onClick={() => setActiveTab('repositories')}
                                className={`px-2 py-3 border-b-2 text-sm flex items-center gap-2 ${activeTab === 'repositories' ? 'border-[#f78166] text-[#c9d1d9] font-medium' : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'}`}
                            >
                                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zM4.5 1.5a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-9a1 1 0 00-1-1h-9z" /></svg>
                                Repositories
                                <span className="bg-[#30363d] text-[#c9d1d9] rounded-full px-2 py-0.5 text-xs">{repos.length}</span>
                            </button>
                            <button 
                                onClick={() => setActiveTab('stars')}
                                className={`px-2 py-3 border-b-2 text-sm flex items-center gap-2 ${activeTab === 'stars' ? 'border-[#f78166] text-[#c9d1d9] font-medium' : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'}`}
                            >
                                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/></svg>
                                Stars
                                <span className="bg-[#30363d] text-[#c9d1d9] rounded-full px-2 py-0.5 text-xs">{starredRepos.length}</span>
                            </button>
                        </nav>
                    </div>

                    <div className="space-y-4">
                        {activeTab === 'repositories' && (
                            <>
                                {repos.length > 0 ? repos.map(repo => (
                                    <div key={repo._id} className="py-6 border-b border-[#30363d] flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Link to={`/repo/${repo._id}`} className="text-xl font-bold text-[#58a6ff] hover:underline">
                                                    {repo.name}
                                                </Link>
                                                <span className="px-2 py-0.5 border border-[#30363d] rounded-full text-xs text-[#8b949e] font-medium capitalize">
                                                    {repo.visibility ? "Public" : "Private"}
                                                </span>
                                            </div>
                                            <p className="text-[#8b949e] text-sm mb-3">
                                                {repo.description || "No description provided."}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getLanguageColor(repo.language) }}></div>
                                                    <span>{repo.language}</span>
                                                </div>
                                                <span>{formatTimeAgo(repo.updatedAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-[#8b949e]">
                                        User doesn't have any repositories yet.
                                    </div>
                                )}
                            </>
                        )}
                        
                        {activeTab === 'stars' && (
                             <>
                             {starredRepos.length > 0 ? starredRepos.map(repo => (
                                 <div key={repo._id} className="py-6 border-b border-[#30363d] flex justify-between items-start">
                                     <div>
                                         <div className="flex items-center gap-2 mb-2">
                                             <Link to={`/repo/${repo._id}`} className="text-xl font-bold text-[#58a6ff] hover:underline">
                                                 {repo.owner?.username || "user"} / {repo.name}
                                             </Link>
                                         </div>
                                         <p className="text-[#8b949e] text-sm mb-3">
                                             {repo.description || "No description provided."}
                                         </p>
                                          <div className="text-xs text-[#8b949e]">
                                             Starred
                                         </div>
                                     </div>
                                 </div>
                             )) : (
                                 <div className="text-center py-12 text-[#8b949e]">
                                     User hasn't starred any repositories yet.
                                 </div>
                             )}
                         </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
