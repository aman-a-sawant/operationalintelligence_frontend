import { useState } from "react";
import {
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../api/authApi";

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

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
        organizationName: formData.organizationName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };

      const response = await signup(payload);

      console.log("Signup Success:", response);

      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-[#030712] to-indigo-950" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <span className="text-3xl font-bold">OPINTEL</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Join OPINTEL
          </h1>

          <p className="text-xl text-gray-400 max-w-xl">
            Start monitoring infrastructure, investigate
            incidents, and leverage AI-powered operational
            intelligence across your organization.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-14">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
              <h3 className="font-semibold text-lg mb-2">
                AI Insights
              </h3>
              <p className="text-gray-400 text-sm">
                Proactive intelligence and recommendations.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
              <h3 className="font-semibold text-lg mb-2">
                Incident Analysis
              </h3>
              <p className="text-gray-400 text-sm">
                Faster root cause detection and resolution.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
              <h3 className="font-semibold text-lg mb-2">
                Service Mapping
              </h3>
              <p className="text-gray-400 text-sm">
                Understand dependencies instantly.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
              <h3 className="font-semibold text-lg mb-2">
                Business Impact
              </h3>
              <p className="text-gray-400 text-sm">
                Connect technical issues to business outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                Create Account
              </h2>

              <p className="text-gray-400">
                Start your operational intelligence journey.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Organization Name */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Organization Name
                </label>

                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-4 top-4 text-gray-500"
                  />

                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="Acme Corporation"
                    className="w-full bg-[#0F172A] border border-gray-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    First Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-4 text-gray-500"
                    />

                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-[#0F172A] border border-gray-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-[#0F172A] border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

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
                    value={formData.email}
                    onChange={handleChange}
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
                    type={
                      showPassword ? "text" : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full bg-[#0F172A] border border-gray-700 rounded-xl py-3 pl-11 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-3.5 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

              {/* Login */}
              <div className="text-center text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Sign In
                </Link>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            © 2026 OPINTEL. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;