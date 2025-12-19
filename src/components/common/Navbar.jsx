import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";

const Navbar = () => {
    const { currentUser, setCurrentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setCurrentUser(null);
        navigate("/auth");
    };

    return (
        <nav className="bg-[#161b22] text-white py-4 px-6 border-b border-[#30363d] flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <img
                        src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                        alt="GitHub"
                        className="w-8 h-8 bg-white rounded-full"
                    />
                    <span className="font-semibold text-xl tracking-tight">GitOrbit</span>
                </Link>
            </div>
            
            <div className="flex items-center gap-4">
                <Link to={`/user/${currentUser}`} className="text-sm font-semibold hover:text-[#58a6ff] transition-colors">
                    Profile
                </Link>
                <button 
                    onClick={handleLogout}
                    className="text-sm font-semibold text-[#f85149] hover:underline"
                >
                    Sign out
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
