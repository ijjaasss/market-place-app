import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { loginAdmin, clearAuthError } from "../features/auth/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated, authChecked ,admin} = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const isLoading = status === "loading";

  useEffect(() => {
    if (authChecked && isAuthenticated) {

        
    navigate("/dashboard", { replace: true });
    }
  }, [authChecked, isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginAdmin(form));
    if (loginAdmin.fulfilled.match(result)) {
      toast.success("Access granted.");
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0F1320] flex items-center justify-center px-4 relative overflow-hidden">
      {/* ambient schematic grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#8991A8 1px, transparent 1px), linear-gradient(90deg, #8991A8 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* status ticker */}
        <div className="flex items-center gap-2 mb-6 font-mono text-[11px] tracking-[0.2em] text-[#8991A8] uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A15C] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A15C]" />
          </span>
          System online // admin-access
        </div>

        {/* panel with corner brackets */}
        <div className="relative">
          <span className="absolute -top-2 -left-2 h-6 w-6 border-t-2 border-l-2 border-[#C9A15C]/70" />
          <span className="absolute -top-2 -right-2 h-6 w-6 border-t-2 border-r-2 border-[#C9A15C]/70" />
          <span className="absolute -bottom-2 -left-2 h-6 w-6 border-b-2 border-l-2 border-[#C9A15C]/70" />
          <span className="absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-[#C9A15C]/70" />

          <div className="bg-[#161B2C] border border-[#2A3142] rounded-md px-8 py-10 shadow-2xl shadow-black/40">
            <div className="flex items-center gap-3 mb-1">
              <div className="h-9 w-9 rounded-md bg-[#C9A15C]/10 border border-[#C9A15C]/30 flex items-center justify-center">
                <ShieldCheck size={18} className="text-[#C9A15C]" />
              </div>
              <h1 className="text-[#EDEFF4] text-lg font-semibold tracking-tight">
                Admin Console
              </h1>
            </div>
            <p className="text-[#8991A8] text-sm mb-8 pl-12 -mt-1">
              Sign in to manage the platform
            </p>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="block font-mono text-[11px] tracking-[0.15em] text-[#8991A8] uppercase mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8991A8]"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className="w-full bg-[#0F1320] border border-[#2A3142] rounded-md pl-10 pr-3 py-2.5 text-sm text-[#EDEFF4] placeholder:text-[#565F78] focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50 focus:border-[#C9A15C]/50 transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block font-mono text-[11px] tracking-[0.15em] text-[#8991A8] uppercase mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8991A8]"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-[#0F1320] border border-[#2A3142] rounded-md pl-10 pr-10 py-2.5 text-sm text-[#EDEFF4] placeholder:text-[#565F78] focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50 focus:border-[#C9A15C]/50 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8991A8] hover:text-[#EDEFF4] transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#C9A15C] hover:bg-[#D9B36E] disabled:opacity-50 disabled:cursor-not-allowed text-[#161B2C] font-semibold text-sm rounded-md py-2.5 transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-[#161B2C]/40 border-t-[#161B2C] animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-[#565F78] text-xs mt-6 font-mono">
          Restricted access. Unauthorized entry is logged.
        </p>
      </div>
    </div>
  );
};

export default Login;