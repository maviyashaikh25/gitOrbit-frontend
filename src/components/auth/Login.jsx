import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { setCurrentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post("http://localhost:3000/login", {
                email: email,
                password: password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);

            setCurrentUser(res.data.userId);
            setLoading(false);
            toast.success("Logged in successfully");
            navigate("/");
        } catch (err) {
            console.error(err);
            toast.error("Login Failed!");
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
                <h1 className="text-2xl font-light text-white">Sign in to GitHub</h1>
            </div>

            <div className="w-full max-w-[340px] bg-[#161b22] border border-[#30363d] rounded-md p-5">
                <form onSubmit={handleLogin} className="space-y-4" noValidate>
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
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-normal text-white">Password</label>
                            <a href="#" className="text-xs text-[#58a6ff] hover:underline">Forgot password?</a>
                        </div>
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
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>

            <div className="w-full max-w-[340px] mt-4 border border-[#30363d] rounded-md p-4 text-center">
                <p className="text-sm text-[#c9d1d9]">
                    New to GitHub?{" "}
                    <Link to="/signup" className="text-[#58a6ff] hover:underline">
                        Create an account
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
};

export default Login;
