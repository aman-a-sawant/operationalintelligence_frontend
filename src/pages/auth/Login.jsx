import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
  e.preventDefault();
    try {
      const payload = {
        email,
        password,
      };

      const response = await login(payload);

      localStorage.setItem(
        "token",
        response.token
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex overflow-x-hidden">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-[#030712] to-indigo-950" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <span className="text-3xl font-bold">OPINTEL</span>
          </div>

          {/* Heading */}
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Welcome Back
          </h1>

          <p className="text-xl text-gray-400 max-w-xl">
            Monitor infrastructure, investigate incidents, and make
            intelligent operational decisions with AI.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-6 mt-14">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
              <h3 className="font-semibold text-lg mb-2">
                AI Root Cause Analysis
              </h3>
              <p className="text-gray-400 text-sm">
                Detect anomalies and identify the real issue instantly.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
              <h3 className="font-semibold text-lg mb-2">
                Business Insights
              </h3>
              <p className="text-gray-400 text-sm">
                Understand service impact and customer experience.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
              <h3 className="font-semibold text-lg mb-2">
                Intelligent Alerts
              </h3>
              <p className="text-gray-400 text-sm">
                Reduce noise with AI-powered prioritization.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
              <h3 className="font-semibold text-lg mb-2">
                Smart Remediation
              </h3>
              <p className="text-gray-400 text-sm">
                Automate operational fixes and recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                Sign in to OPINTEL
              </h2>
              <p className="text-gray-400">
                Access your operational intelligence workspace.
              </p>
            </div>

            <form
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              {/* Email */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Work Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-4 text-gray-500"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    className="w-full bg-[#0F172A] border border-gray-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-4 text-gray-500"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    className="w-full bg-[#0F172A] border border-gray-700 rounded-xl py-3 pl-11 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />

                  <button
                    type="button"
                    className="absolute right-4 top-3.5 text-gray-400"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    className="accent-blue-600"
                  />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 transition-all"
              >
                Sign In
              </button>

              {/* Signup */}
              <div className="text-center text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Create Account
                </Link>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            © 2026 OPINTEL. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;