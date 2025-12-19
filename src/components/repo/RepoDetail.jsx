import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import { formatTimeAgo } from "../../utils/timeUtils";
import toast from "react-hot-toast";

import FileViewer from "./FileViewer";

const RepoDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [repo, setRepo] = useState(null);
    const [issues, setIssues] = useState([]);
    const [activeTab, setActiveTab] = useState("code");
    const [newIssue, setNewIssue] = useState({ title: "", description: "" });
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState("");
    const [downloadUrl, setDownloadUrl] = useState("");
    const [viewingFile, setViewingFile] = useState(false);

    useEffect(() => {
        const fetchRepoData = async () => {
            try {
                const repoRes = await axios.get(`http://localhost:3000/repo/${id}`);
                setRepo(repoRes.data);
                
                // Fetch issues
                const issuesRes = await axios.get(`http://localhost:3000/issue/all/${id}`);
                setIssues(issuesRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching repo data:", err);
                setLoading(false);
            }
        };
        if (id) fetchRepoData();
    }, [id]);

    const handleCreateIssue = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:3000/issue/create/${id}`, newIssue);
            setIssues([...issues, res.data]);
            setNewIssue({ title: "", description: "" });
            toast.success("Issue created successfully");
        } catch (err) {
           console.error("Error creating issue:", err);
           toast.error("Failed to create issue");
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", ""); // Upload to root

        try {
            await axios.post(`http://localhost:3000/repo/upload/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            // Refresh repo data
            const repoRes = await axios.get(`http://localhost:3000/repo/${id}`);
            setRepo(repoRes.data);
            setRepo(repoRes.data);
            toast.success("File uploaded successfully");
        } catch (err) {
            console.error("Error uploading file:", err);
            console.error("Error uploading file:", err);
            toast.error("Failed to upload file");
        }
    };

    const handleFileClick = async (file) => {
        if (file.type && file.type === "dir") return; 
        // Logic for handling legacy strings if any exist
        if (typeof file === "string") return; 

        setViewingFile(true);
        setSelectedFile(file);
        setFileContent("Loading...");
        setDownloadUrl("");
        try {
            const res = await axios.get(`http://localhost:3000/repo/content/${id}?path=${file.path}`);
            setFileContent(res.data.content);
            setDownloadUrl(res.data.downloadUrl);
        } catch (err) {
            console.error("Error fetching file content:", err);
            setFileContent("Error loading content. File might not exist in S3.");
        }
    };

    if (loading) return <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">Loading...</div>;
    if (!repo) return <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">Repository not found</div>;

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
            <Navbar />
            
            <div className="bg-[#161b22] border-b border-[#30363d] pt-4 px-4 md:px-8">
                <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-[#8b949e]" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zM4.5 1.5a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-9a1 1 0 00-1-1h-9z"></path></svg>
                    <span className="text-[#58a6ff] text-xl font-semibold cursor-pointer hover:underline">{repo.owner?.username || "Owner"}</span>
                    <span className="text-[#8b949e] mx-1">/</span>
                    <span className="text-[#58a6ff] text-xl font-bold cursor-pointer hover:underline">{repo.name}</span>
                    <span className="ml-2 px-2 py-0.5 text-xs ring-1 ring-[#30363d] rounded-full text-[#8b949e] font-medium bg-transparent capitalize">
                        {repo.visibility ? "Public" : "Private"}
                    </span>
                </div>

                <div className="flex gap-1 mt-4 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab("code")}
                        className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === "code" ? "border-[#f78166] text-[#c9d1d9]" : "border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:border-[#8b949e]"}`}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M4.72 3.22a.75.75 0 011.06 1.06L2.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L.47 8.53a.75.75 0 010-1.06l4.25-4.25zm6.56 0a.75.75 0 10-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 101.06 1.06l4.25-4.25a.75.75 0 000-1.06l-4.25-4.25z"></path></svg>
                        Code
                    </button>
                    <button 
                        onClick={() => setActiveTab("issues")}
                        className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === "issues" ? "border-[#f78166] text-[#c9d1d9]" : "border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:border-[#8b949e]"}`}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path><path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"></path></svg>
                        Issues 
                        <span className="bg-[#30363d] text-[#c9d1d9] rounded-full px-2 py-0.5 text-xs">{issues.length}</span>
                    </button>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto p-4 md:p-8">
                {activeTab === "code" && (
                    <div className="border border-[#30363d] rounded-md bg-[#0d1117]">
                        <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] rounded-t-md flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">{repo.owner?.username}</span>
                                <span className="text-[#8b949e] text-xs">Initial commit</span>
                            </div>
                            <div className="relative">
                                <label className="bg-[#238636] text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-[#2ea043] transition-colors cursor-pointer">
                                    Add File
                                    <input type="file" className="hidden" onChange={handleFileUpload} />
                                </label>
                            </div>
                        </div>
                        <div className="bg-[#0d1117]">
                            {/* Assuming content is an array of filenames or objects. If it's empty, show placeholder */}
                             {repo.content && repo.content.length > 0 ? (
                                repo.content.map((file, index) => {
                                    const fileName = typeof file === "string" ? file : file.name;
                                    return (
                                    <div key={index} 
                                        onClick={() => handleFileClick(file)}
                                        className="px-4 py-2 border-b border-[#21262d] last:border-0 hover:bg-[#161b22] flex items-center gap-3 text-sm text-[#c9d1d9] cursor-pointer">
                                        <svg className="w-4 h-4 text-[#8b949e]" viewBox="0 0 16 16" fill="currentColor"><path d="M3.75 1.5a.25.25 0 00-.25.25v11.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V6H9.75A1.75 1.75 0 018 4.25V1.5H3.75zm5.75.568V4.25c0 .414.336.75.75.75h2.182a.25.25 0 00.19-.41l-2.932-2.95a.25.25 0 00-.19-.058z"></path></svg>
                                        <span>{fileName}</span>
                                        <span className="text-[#8b949e] ml-auto text-xs">{formatTimeAgo(file.lastModified)}</span>
                                    </div>
                                    );
                                })
                             ) : (
                                <div className="p-8 text-center text-[#8b949e]">
                                    <p>This repository is empty.</p>
                                </div>
                             )}
                        </div>
                         {/* Readme Area */}
                        {(repo.description || repo.content.length === 0) && (
                            <div className="mt-6 border border-[#30363d] rounded-md">
                                <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] rounded-t-md text-sm font-medium">README.md</div>
                                <div className="p-6 text-[#c9d1d9]">
                                    <h3 className="text-2xl font-semibold mb-2">{repo.name}</h3>
                                    <p>{repo.description || "No description provided."}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "issues" && (
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-3">
                            <div className="border border-[#30363d] rounded-md bg-[#0d1117] mb-6">
                                <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] rounded-t-md flex items-center justify-between">
                                     <div className="font-semibold text-white">Open Issues</div>
                                     <button 
                                        onClick={() => document.getElementById('issue-form').scrollIntoView({ behavior: 'smooth' })}
                                        className="bg-[#238636] text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-[#2ea043] transition-colors"
                                    >
                                        New Issue
                                     </button>
                                </div>
                                <div>
                                    {issues.length > 0 ? (
                                        issues.map((issue) => (
                                            <div key={issue._id} className="p-4 border-b border-[#21262d] last:border-0 hover:bg-[#161b22] group">
                                                <div className="flex gap-2 items-start">
                                                    <svg className="w-5 h-5 text-[#3fb950] mt-1" viewBox="0 0 16 16" fill="currentColor"><path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path><path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"></path></svg>
                                                    <div>
                                                        <a href="#" className="font-semibold text-[#c9d1d9] group-hover:text-[#58a6ff] hover:underline mb-1 block">
                                                            {issue.title}
                                                        </a>
                                                        <div className="text-xs text-[#8b949e]">
                                                            #{issue._id.slice(-4)} opened by {repo.owner?.username || "user"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-12 text-center">
                                            <svg className="w-8 h-8 mx-auto text-[#8b949e] mb-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path><path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"></path></svg>
                                            <h3 className="font-semibold text-white mb-1">Welcome to issues!</h3>
                                            <p className="text-[#8b949e] text-sm">Issues are used to track todos, bugs, feature requests, and more.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Create Issue Form */}
                            <div id="issue-form" className="border border-[#30363d] rounded-md bg-[#0d1117] p-4">
                                <h3 className="font-semibold text-white mb-4">Create a new issue</h3>
                                <form onSubmit={handleCreateIssue}>
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-white focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 focus:outline-none mb-4"
                                            value={newIssue.title}
                                            onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                                            required
                                        />
                                        <textarea
                                            placeholder="Leave a comment"
                                            className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-white focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 focus:outline-none min-h-[150px]"
                                            value={newIssue.description}
                                            onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-end">
                                        <button 
                                            type="submit" 
                                            className="bg-[#238636] text-white px-4 py-2 rounded-md font-medium hover:bg-[#2ea043] transition-colors"
                                        >
                                            Submit new issue
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                     </div>
                )}
            </div>
            {viewingFile && (
                <FileViewer 
                    content={fileContent} 
                    fileName={selectedFile?.name} 
                    downloadUrl={downloadUrl}
                    onClose={() => setViewingFile(false)} 
                />
            )}
        </div>
    );
};

export default RepoDetail;
