import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { setCurrentUser } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        
        if (!email || !username || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post("http://localhost:3000/signup", {
                email: email,
                password: password,
                username: username,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);

            setCurrentUser(res.data.userId);
            setLoading(false);
            toast.success("Account created successfully");
            navigate("/");
        } catch (err) {
            console.error(err);
            toast.error("Signup Failed!");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-4">
            <div className="mb-8">
                <img
                    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                    alt="GitHub Logo"
                    className="w-12 h-12 bg-white rounded-full"
                />
            </div>
            
            <div className="w-full max-w-xs text-center mb-4">
                <h1 className="text-2xl font-light text-white">Join GitHub</h1>
            </div>

            <div className="w-full max-w-[340px] bg-[#161b22] border border-[#30363d] rounded-md p-5">
                <form onSubmit={handleSignup} className="space-y-4" noValidate>
                    <div>
                        <label className="block text-sm font-normal text-white mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-3 py-[5px] bg-[#0d1117] border border-[#30363d] rounded-md text-white focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 focus:outline-none text-sm transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-normal text-white mb-2">Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-[5px] bg-[#0d1117] border border-[#30363d] rounded-md text-white focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 focus:outline-none text-sm transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-normal text-white mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-[5px] bg-[#0d1117] border border-[#30363d] rounded-md text-white focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 focus:outline-none text-sm transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-medium py-[5px] px-4 rounded-md text-sm border border-[#rgba(240,246,252,0.1)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>
            </div>

            <div className="w-full max-w-[340px] mt-4 border border-[#30363d] rounded-md p-4 text-center">
                <p className="text-sm text-[#c9d1d9]">
                    Already have an account?{" "}
                    <Link to="/auth" className="text-[#58a6ff] hover:underline">
                        Sign in
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
};

export default Signup;
