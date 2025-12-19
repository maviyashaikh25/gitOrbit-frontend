import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../authContext";

const LeftSidebar = () => {
  const [repos, setRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        if (currentUser) {
          const response = await axios.get(
            `http://localhost:3000/repo/user/${currentUser}`
          );
          if (response.data.repositories) {
            setRepos(response.data.repositories);
          }
        }
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };

    fetchRepos();
  }, [currentUser]);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#0d1117] text-[#c9d1d9] p-4 border-r border-[#30363d] hidden md:block h-screen sticky top-0 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-sm">Top repositories</span>
        <button
          onClick={() => navigate("/repo/create")}
          className="bg-[#238636] text-white px-2 py-1 rounded-md text-xs font-medium hover:bg-[#2ea043] flex items-center gap-1"
        >
          <svg
            aria-hidden="true"
            height="16"
            viewBox="0 0 16 16"
            version="1.1"
            width="16"
            data-view-component="true"
            className="octicon octicon-repo text-white fill-current"
          >
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8ZM5 12.25v3.25a.25.25 0 0 0 .4.2l1.35-1.083a.25.25 0 0 1 .32 0L8.4 15.7a.25.25 0 0 0 .4-.2v-3.25a.25.25 0 0 0-.25-.25h-3a.25.25 0 0 0-.25.25Z"></path>
          </svg>
          New
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Find a repository..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1 text-sm text-[#c9d1d9] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] outline-none transition-colors"
        />
      </div>

      <ul className="space-y-2">
        {filteredRepos.map((repo) => (
          <li key={repo._id} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-600 flex-shrink-0">
              {/* Placeholder for owner avatar if needed, using generic repo icon for now */}
              <svg
                aria-hidden="true"
                height="16"
                viewBox="0 0 16 16"
                version="1.1"
                width="16"
                data-view-component="true"
                className="octicon octicon-repo fill-[#8b949e]"
              >
                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8ZM5 12.25v3.25a.25.25 0 0 0 .4.2l1.35-1.083a.25.25 0 0 1 .32 0L8.4 15.7a.25.25 0 0 0 .4-.2v-3.25a.25.25 0 0 0-.25-.25h-3a.25.25 0 0 0-.25.25Z"></path>
              </svg>
            </div>
            <Link
              to={`/user/${repo.owner._id}`}
              className="text-sm font-semibold text-[#c9d1d9] hover:underline hover:text-[#58a6ff]"
            >
              {repo.owner.username}
            </Link>
            <span className="text-[#c9d1d9]">/</span>
            <Link
              to={`/repo/${repo._id}`}
              className="text-sm font-semibold text-[#c9d1d9] hover:underline hover:text-[#58a6ff] font-bold"
              title={repo.name}
            >
              {repo.name}
            </Link>
          </li>
        ))}
      </ul>
      {filteredRepos.length > 7 && (
        <div className="mt-4 text-xs text-[#8b949e] cursor-pointer hover:text-[#58a6ff]">
          Show more
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
