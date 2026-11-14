import { useState, useId } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function NuraLogo({ size = 44 }) {
  const id = useId().replace(/:/g, "");

  const colors = [
    "#E77D91", // Warm Pink
    "#EBC9A9", // Soft Peach
    "#A83D55", // Berry
    "#F6BFC1", // Dusty Rose
    "#E77D91", // Warm Pink
    "#EBC9A9", // Soft Peach
    "#A83D55", // Berry
    "#F6BFC1", // Dusty Rose
  ];

  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        role="img"
        aria-label="Nura flower logo"
      >
        <defs>
          {colors.map((color, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const tipX = 32 + 27 * Math.sin(angle);
            const tipY = 32 - 27 * Math.cos(angle);

            return (
              <linearGradient
                key={i}
                id={`${id}-petal-${i}`}
                gradientUnits="userSpaceOnUse"
                x1="32"
                y1="32"
                x2={tipX}
                y2={tipY}
              >
                <stop offset="0%" stopColor="#FFF7F2" />
                <stop offset="35%" stopColor="#FCE4E4" />
                <stop offset="70%" stopColor="#F6BFC1" />
                <stop offset="100%" stopColor={color} />
              </linearGradient>
            );
          })}
        </defs>

        {colors.map((_, i) => (
          <path
            key={i}
            d="M32 32 C21 26 21 14 32 5 C43 14 43 26 32 32Z"
            fill={`url(#${id}-petal-${i})`}
            transform={`rotate(${i * 45} 32 32)`}
            opacity="0.9"
          />
        ))}

        <circle cx="32" cy="32" r="4.5" fill="#FFF7F2" />
        <circle cx="32" cy="32" r="2.2" fill="#A83D55" />
      </svg>

      <span className="font-serif text-3xl font-semibold tracking-tight text-[#542B35]">
        nura
      </span>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login({
        email: email.trim().toLowerCase(),
        password,
      });

      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      if (err.status === 0) {
        setError("Unable to sign in. Please check your internet connection and try again.");
      } else if (err.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (err.status === 429) {
        setError("Too many login attempts. Please wait a few moments and try again.");
      } else if (err.errors && err.errors.length > 0) {
        setError(err.errors.map((item) => item.message).join(". "));
      } else {
        setError(err.message || "Unable to sign in. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nura-page relative flex min-h-screen flex-col justify-between overflow-hidden text-[#542B35]">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-[#EAAEA5]/20 blur-3xl" />
        <div className="absolute top-1/2 -left-20 h-96 w-96 rounded-full bg-[#F5D7BB]/25 blur-3xl" />
        <div className="absolute -bottom-20 right-10 h-80 w-80 rounded-full bg-[#FCE4E4]/35 blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-6 sm:px-12">
        <Link to="/" aria-label="Nura Home" className="transition hover:opacity-90">
          <NuraLogo size={38} />
        </Link>
        <Link
          to="/"
          className="text-xs sm:text-sm font-medium text-[#806B68] transition hover:text-[#C94F6C]"
        >
          ← Back to home
        </Link>
      </header>

      {/* Main Form Container */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#F0DDD5] bg-white/90 p-8 shadow-[0_10px_35px_rgba(84,43,53,0.06)] backdrop-blur-md sm:p-10">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F0D8D2] bg-[#FFF8F3] px-3.5 py-1 text-xs font-semibold text-[#A83D55]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A83D55]" />
              Welcome Back
            </span>
            <h1 className="mt-4 font-serif text-3xl font-semibold text-[#542B35]">
              Sign in to Nura
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#806B68]">
              Continue tracking your cycle rhythm and personal wellness.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-[#F6BFC1] bg-[#FDE8E8] p-3.5 text-xs text-[#8D2B44] animate-fade-in">
              <svg
                className="h-4 w-4 shrink-0 text-[#C94F6C] mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-[#947875]"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="elena@example.com"
                className="mt-2 w-full rounded-xl border border-[#F0DDD5] bg-[#FFF8F3]/70 px-4 py-3 text-sm text-[#542B35] placeholder-[#A18480] transition focus:border-[#C94F6C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C94F6C]/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#947875]"
              >
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#F0DDD5] bg-[#FFF8F3]/70 px-4 py-3 pr-11 text-sm text-[#542B35] placeholder-[#A18480] transition focus:border-[#C94F6C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C94F6C]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-xs text-[#A18480] hover:text-[#542B35] transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C94F6C] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#C94F6C]/25 transition hover:bg-[#AA3D59] hover:shadow-xl active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-8 border-t border-[#F7EDE8] pt-6 text-center text-xs text-[#806B68]">
            <span>Don't have an account? </span>
            <Link
              to="/register"
              className="font-semibold text-[#C94F6C] hover:text-[#AA3D59] hover:underline transition"
            >
              Create one now
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-[#A18480]">
        <p>© {new Date().getFullYear()} Nura. Mindful cycle tracking with complete privacy.</p>
      </footer>
    </div>
  );
}

