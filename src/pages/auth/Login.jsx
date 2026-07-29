import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const response = await login(payload);

      // Adjust based on your API response
      localStorage.setItem("token", response.token);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);

      alert(
        error?.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#030712] text-white overflow-hidden">
      <div className="flex h-full">
        {/* Left Section */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-[#030712] to-indigo-950" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <span className="text-3xl font-bold">
                OPINTEL
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-tight mb-6">
              Welcome Back
            </h1>

            <p className="text-lg text-gray-400 max-w-xl">
              Monitor infrastructure, investigate incidents,
              and make intelligent operational decisions
              with AI.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4">
                <h3 className="font-semibold mb-2">
                  AI Root Cause Analysis
                </h3>
                <p className="text-gray-400 text-sm">
                  Detect anomalies and identify issues
                  instantly.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4">
                <h3 className="font-semibold mb-2">
                  Business Insights
                </h3>
                <p className="text-gray-400 text-sm">
                  Understand service impact and customer
                  experience.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4">
                <h3 className="font-semibold mb-2">
                  Intelligent Alerts
                </h3>
                <p className="text-gray-400 text-sm">
                  Prioritize incidents with AI-driven
                  intelligence.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4">
                <h3 className="font-semibold mb-2">
                  Smart Remediation
                </h3>
                <p className="text-gray-400 text-sm">
                  Automate operational fixes and
                  recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">
                  Sign in to OPINTEL
                </h2>

                <p className="text-gray-400">
                  Access your operational intelligence
                  workspace.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Work Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-3.5 text-gray-500"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className="w-full bg-[#0F172A] border border-gray-700 rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="absolute left-4 top-3.5 text-gray-500"
                    />

                    <input
                      type={
                        showPassword ? "text" : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="w-full bg-[#0F172A] border border-gray-700 rounded-xl py-2.5 pl-11 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />

                    <button
                      type="button"
                      className="absolute right-4 top-3 text-gray-400"
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

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 transition-all disabled:opacity-50"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>

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

            <div className="mt-4 text-center text-xs text-gray-500">
              © 2026 OPINTEL. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;