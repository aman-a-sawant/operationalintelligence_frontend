import { useState } from "react";
import {
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { signup } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    organizationName: "",
    firstName: "",
    lastName: "",
    email: "",
    passwordHash: "",
    roles: "",
    status: "",
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
    const payload = {
      organizationName: formData.organizationName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.passwordHash, // plain password
      roles: [formData.roles],
      status: formData.status,
    };
    const response = await signup(payload);
    console.log("Signup Success:", response);
    // Navigate to Login
    navigate("/login");
    } catch (error) {
    console.error("Signup Error:", error);
    alert(
      error?.response?.data?.message ||
      "Failed to create account"
    );
  }
};

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="flex min-h-screen">
        {/* Left Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-950 via-slate-950 to-indigo-950">
          <div className="flex flex-col justify-center px-16">
            <div className="flex items-center gap-3 mb-10">
              <h1 className="text-4xl font-bold">OPINTEL</h1>
            </div>

            <h2> Intelligence Hub</h2>

            <p className="text-lg text-gray-300 max-w-lg">
              Start monitoring infrastructure, tracking business
              journeys, investigating incidents, and leveraging
              AI-powered operational intelligence.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-12">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-2">
                  AI Insights
                </h3>
                <p className="text-sm text-gray-400">
                  Proactive intelligence and recommendations.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-2">
                  Incident Analysis
                </h3>
                <p className="text-sm text-gray-400">
                  Faster root cause detection and resolution.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-2">
                  Service Mapping
                </h3>
                <p className="text-sm text-gray-400">
                  Understand dependencies instantly.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-2">
                  Business Impact
                </h3>
                <p className="text-sm text-gray-400">
                  Connect technical issues to business outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-xl">
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold">
                  Create Account
                </h2>
                <p className="text-gray-400 mt-2">
                  Join OPINTEL and start managing your
                  organization.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Organization */}
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
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Email Address
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
                      placeholder="name@company.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      name="passwordHash"
                      value={formData.passwordHash}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* Role & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Role
                    </label>

                    <select
                      name="roles"
                      value={formData.roles}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>Select</option>
                      <option value="OWNER">OWNER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="MEMBER">MEMBER</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Status
                    </label>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>Select</option>
                      <option value="ACTIVE">
                        ACTIVE
                      </option>
                      <option value="INACTIVE">
                        INACTIVE
                      </option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 transition-all"
                >
                  Create Account
                </button>

                <p className="text-center text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;