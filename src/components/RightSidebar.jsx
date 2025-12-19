import React from 'react';

const RightSidebar = () => {
    // Static data for trending, can be replaced with API later
    const trendingRepos = [
        { id: 1, name: 'facebook/react', description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.', stars: '200k' },
        { id: 2, name: 'vuejs/vue', description: 'The Progressive JavaScript Framework.', stars: '190k' },
        { id: 3, name: 'angular/angular', description: 'One framework. Mobile & desktop.', stars: '80k' }
    ];

    return (
        <div className="bg-[#0d1117] text-[#c9d1d9] p-4 hidden lg:block h-screen sticky top-0 overflow-y-auto w-full">
            <div className="mb-6">
                 <h2 className="font-semibold text-white mb-4">GitHub Trending</h2>
                 <div className="space-y-4">
                     {trendingRepos.map(repo => (
                         <div key={repo.id} className="border border-[#30363d] rounded-md p-3 bg-[#161b22]">
                             <div className="font-semibold text-[#58a6ff] hover:underline cursor-pointer mb-1">
                                 {repo.name}
                             </div>
                             <p className="text-xs text-[#8b949e] mb-2">{repo.description}</p>
                             <div className="text-xs font-semibold text-[#c9d1d9]">
                                 {repo.stars} stars
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
            
             <div className="text-xs text-[#8b949e]">
                 <a href="#" className="hover:text-[#58a6ff] mr-2">© 2024 GitOrbit</a>
                 <a href="#" className="hover:text-[#58a6ff] mr-2">Terms</a>
                 <a href="#" className="hover:text-[#58a6ff] mr-2">Privacy</a>
             </div>
        </div>
    );
};

export default RightSidebar;
