export const getLanguageColor = (language) => {
    switch (language) {
        case 'JavaScript':
            return '#f1e05a';
        case 'TypeScript':
            return '#2b7489';
        case 'Python':
            return '#3572A5';
        case 'Java':
            return '#b07219';
        case 'C++':
            return '#f34b7d';
        case 'C':
            return '#555555';
        case 'HTML':
            return '#e34c26';
        case 'CSS':
            return '#563d7c';
        case 'JSON':
            return '#292929';
        case 'Go':
            return '#00ADD8';
        case 'Rust':
            return '#dea584';
        case 'PHP':
            return '#4F5D95';
        case 'Ruby':
             return '#701516';
        case 'SQL':
             return '#e38c00';
        case 'Jupyter Notebook':
            return '#DA5B0B';
        case 'Shell':
             return '#89e051';
        case 'Plain Text':
            return '#8b949e';
        default:
            return '#8b949e'; // Default grey
    }
};
