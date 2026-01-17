import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const googleSignup = useGoogleLogin({
    onSuccess: (response) => {
      axios
        .post(import.meta.env.VITE_BACKEND_URL + "/api/users/google-login", {
          token: response.access_token,
        })
        .then((response) => {
          console.log(response.data);
          localStorage.setItem("token", response.data.token);
          toast.success("Registration successful");
          navigate("/");
        })
        .catch(() => {
          toast.error("Google signup failed");
        });
    },
  });

  async function register(e) {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/users/register",
        { name, email, password }
      );
      toast.success("Registration successful! Please check your email for verification code.");
      setShowVerification(true);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyEmail(e) {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Please enter the verification code");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/users/verify-email",
        { email, otp }
      );
      toast.success("Email verified successfully! You can now login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/loginbg.png')" }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-linear-to-br from-blue-900/40 via-slate-800/50 to-slate-900/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="backdrop-blur-xl bg-white/6 rounded-3xl shadow-2xl border border-white/10 p-8 md:p-10">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-amber-400 to-amber-500" style={{ fontFamily: "cursive" }}>
              Wealth
            </h1>
            <p className="text-white/80 text-sm mt-2">
              {showVerification ? "Verify your email" : "Create your account to get started."}
            </p>
          </div>

          <div>
            {!showVerification ? (
              <form onSubmit={register} className="space-y-5">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-white/60" />
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  required
                  className="w-full bg-white/6 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/60" />
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className="w-full bg-white/6 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/60" />
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-white/6 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/60" />
                </div>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full bg-white/6 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          ) : (
            <form onSubmit={verifyEmail} className="space-y-5">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Verification Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/60" />
                  </div>
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    type="text"
                    required
                    maxLength="6"
                    className="w-full bg-white/6 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 text-center text-2xl tracking-widest"
                    placeholder="000000"
                  />
                </div>
                <p className="text-white/60 text-xs mt-2">Enter the 6-digit code sent to {email}</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify Email"
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowVerification(false)}
                className="w-full bg-transparent border border-white/20 text-white font-semibold py-2 rounded-xl hover:bg-white/5 transition-all duration-200"
              >
                Back to Registration
              </button>
            </form>
          )}

          {!showVerification && (
            <>
              <div className="mt-5 text-center">
                <p className="text-white/70 text-sm">
                  Already have an account? <Link to="/login" className="text-blue-300 font-semibold">Sign in</Link>
                </p>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-white/50">Or sign up with</span>
                </div>
              </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={googleSignup}
              className="flex items-center justify-center gap-2 bg-white/6 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={() => toast("Continue with Facebook (placeholder)")}
              className="flex items-center justify-center gap-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/15 border border-[#1877F2]/30 text-white py-2.5 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.48 2 2 6.48 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H8.48v-2.9h2.0V9.41c0-1.99 1.18-3.09 2.99-3.09.87 0 1.78.15 1.78.15v1.96h-1.0c-1.0 0-1.31.62-1.31 1.25v1.51h2.23l-.36 2.9h-1.87v7.03C18.34 21.2 22 17.06 22 12.07z" />
              </svg>
              Facebook
            </button>
          </div>
          </>
          )}

          <p className="text-center text-white/50 text-xs mt-6">Protected by security encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
}