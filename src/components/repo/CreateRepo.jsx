import React, { useState } from 'react';
import { useAuth } from '../../authContext';
import axios from 'axios';
import Navbar from '../common/Navbar';
import { useNavigate } from 'react-router-dom';

const CreateRepo = () => {
    const [repoName, setRepoName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState(true); // true for Public, false for Private
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!repoName) {
            alert("Repository name is required");
            return;
        }

        try {
            const payload = {
                name: repoName,
                description: description,
                visibility: visibility,
                owner: currentUser,
                content: [],
                issues: []
            };

            const response = await axios.post("http://localhost:3000/repo/create", payload);
            
            if (response.status === 201) {
                navigate(`/repo/${response.data.repositoryID}`);
            }

        } catch (err) {
            console.error("Error creating repository:", err);
            alert("Failed to create repository. " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
            <Navbar />
            <div className="max-w-4xl mx-auto p-8">
                <div className="mb-8 border-b border-[#30363d] pb-4">
                    <h1 className="text-2xl font-semibold text-white">Create a new repository</h1>
                    <p className="text-[#8b949e]">A repository contains all project files, including the revision history.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2 text-white">
                            Owner *
                        </label>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-[#21262d] px-3 py-1.5 rounded-md border border-[#30363d] text-sm">
                                {/* Ideally fetch username, currently using ID or place holder */}
                                Current User
                            </div>
                            <span className="text-xl">/</span>
                            <div className="flex-1">
                                <label className="sr-only">Repository name</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 focus:outline-none text-white text-sm"
                                    placeholder="Repository name"
                                    value={repoName}
                                    onChange={(e) => setRepoName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <p className="text-xs text-[#8b949e]">
                            Great repository names are short and memorable.
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2 text-white">Description <span className="text-[#8b949e] font-normal">(optional)</span></label>
                        <input
                            type="text"
                            className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 focus:outline-none text-white text-sm"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <hr className="border-[#30363d] my-6" />

                    <div className="mb-6">
                        <div className="mb-2">
                             <label className="flex items-start gap-3 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="visibility" 
                                    checked={visibility === true} 
                                    onChange={() => setVisibility(true)}
                                    className="mt-1 bg-transparent border-[#30363d] focus:ring-0 checked:bg-[#58a6ff]" 
                                />
                                <div>
                                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className="octicon octicon-repo fill-[#8b949e]">
                                            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8ZM5 12.25v3.25a.25.25 0 0 0 .4.2l1.35-1.083a.25.25 0 0 1 .32 0L8.4 15.7a.25.25 0 0 0 .4-.2v-3.25a.25.25 0 0 0-.25-.25h-3a.25.25 0 0 0-.25.25Z"></path>
                                        </svg>
                                        Public
                                    </div>
                                    <p className="text-xs text-[#8b949e]">Anyone on the internet can see this repository. You choose who can commit.</p>
                                </div>
                             </label>
                        </div>
                        <div>
                             <label className="flex items-start gap-3 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="visibility" 
                                    checked={visibility === false} 
                                    onChange={() => setVisibility(false)}
                                    className="mt-1 bg-transparent border-[#30363d] focus:ring-0 checked:bg-[#58a6ff]" 
                                />
                                <div>
                                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className="octicon octicon-lock fill-[#8b949e]">
                                            <path d="M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4V4Zm4-2.5a2.5 2.5 0 0 0-2.5 2.5v2h5v-2a2.5 2.5 0 0 0-2.5-2.5ZM3.75 7.5a.25.25 0 0 0-.25.25v5.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5Z"></path>
                                        </svg>
                                        Private
                                    </div>
                                    <p className="text-xs text-[#8b949e]">You choose who can see and commit to this repository.</p>
                                </div>
                             </label>
                        </div>
                    </div>

                    <hr className="border-[#30363d] my-6" />

                    <button 
                        type="submit" 
                        className="bg-[#238636] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-[#2ea043] transition-colors"
                    >
                        Create repository
                    </button>
                    
                </form>
            </div>
        </div>
    );
};

export default CreateRepo;
