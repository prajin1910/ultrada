import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import toast from "react-hot-toast";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
    professorEmail: "",
  });
  const [otpData, setOtpData] = useState({
    email: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      await authAPI.register(formData);
      toast.success("Registration successful! Please check your email for OTP.");
      setOtpData({ ...otpData, email: formData.email });
      setShowOtpVerification(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.verifyOTP(otpData.email, otpData.otp);
      toast.success("Email verified successfully! You can now login.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await authAPI.resendOTP(otpData.email);
      toast.success("OTP sent successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  if (showOtpVerification) {
    return (
      <div className="bg-neutral-100 text-neutral-900 font-['Inter',sans-serif]">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="rounded-2xl bg-white p-8 shadow-2xl">
              <div className="mb-8 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  Verify Your Email
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  We've sent a verification code to {otpData.email}
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-neutral-700"
                  >
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-3 text-center text-lg tracking-widest focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="0000"
                    value={otpData.otp}
                    onChange={(e) =>
                      setOtpData({ ...otpData, otp: e.target.value })
                    }
                    maxLength={4}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otpData.otp.length !== 4}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50"
                  >
                    Didn't receive the code? Resend
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowOtpVerification(false)}
                    className="text-sm text-neutral-600 hover:text-neutral-500"
                  >
                    Back to registration
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 text-neutral-900 font-['Inter',sans-serif]">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="rounded-2xl bg-white p-8 shadow-2xl md:p-12">
            <div className="mb-8 text-center">
              <div className="mb-4 flex justify-center">
                <svg
                  className="h-12 w-12 text-blue-500"
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
                Create Your Account
              </h1>
              <p className="mt-2 text-neutral-600">
                Join SmartEval and unlock intelligent assessment tools
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-neutral-700"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="your.email@university.edu"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="STUDENT">Student</option>
                  <option value="PROFESSOR">Professor</option>
                  <option value="ALUMNI">Alumni</option>
                </select>
              </div>

              {formData.role === "PROFESSOR" && (
                <div>
                  <label
                    htmlFor="professorEmail"
                    className="block text-sm font-medium text-neutral-700"
                  >
                    Institution Email (for verification)
                  </label>
                  <input
                    type="email"
                    id="professorEmail"
                    className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="professor@university.edu"
                    value={formData.professorEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, professorEmail: e.target.value })
                    }
                    required={formData.role === "PROFESSOR"}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-neutral-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    minLength={8}
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-neutral-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-neutral-700">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-neutral-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
