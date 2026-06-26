import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const GOOGLE_MSGS = [
  "Google is busy watching One Piece. 🏴‍☠️",
  "Google is collecting Dragon Balls. 🐉",
  "Google is trapped inside the Infinite Tsukuyomi. 😴",
  "Google is training with Gojo. 👁️",
  "Google is binge watching Solo Leveling. ⚔️",
  "Google got lost in the Soul Society. 👻",
  "Google is competing in the Chunin Exams. 🥷",
];

const GITHUB_MSGS = [
  "GitHub is fixing merge conflicts. 😤",
  "GitHub is reviewing pull requests. 🔍",
  "GitHub is deploying AnimeVerse. 🚀",
  "GitHub is debugging another repository. 🐛",
  "GitHub pushed to the wrong branch again. 😅",
  "GitHub Actions is still running... ⏳",
];

const LOADING_MSGS = [
  "Finding your anime profile...",
  "Preparing AnimeVerse...",
  "Loading your watchlist...",
  "Counting your episodes...",
  "Powering up your account...",
];

const Toast = ({ message, onClose }) => (
  <div
    className="fixed bottom-6 left-1/2 z-[999] px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-lg"
    style={{
      transform: "translateX(-50%)",
      background: "rgba(20,20,20,0.95)",
      border: "1px solid rgba(229,22,58,0.4)",
      animation: "fadeSlideUp 0.3s ease",
      backdropFilter: "blur(12px)",
    }}
  >
    {message}
    <style>{`
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateX(-50%) translateY(12px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
    `}</style>
  </div>
);

const SignIn = ({ onLogin }) => {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const handleGoogle = () => showToast(random(GOOGLE_MSGS));
  const handleGithub = () => showToast(random(GITHUB_MSGS));

  const validate = () => {
    const e = {};
    if (!displayName.trim()) e.displayName = "Please enter your Display Name.";
    if (!username.trim()) e.username = "Please enter your Username.";
    if (!password.trim()) e.password = "Please enter your Password.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignIn = async () => {
    if (!validate()) return;

    setLoading(true);
    setLoadingMsg(random(LOADING_MSGS));

    await new Promise((r) => setTimeout(r, 2000));

    localStorage.setItem("animeverseUser", displayName.trim());
    onLogin(displayName.trim());

    setLoading(false);
    setSuccess(true);

    setTimeout(() => navigate("/"), 2200);
  };

  const inputBase =
    "w-full bg-[#0e0e0e] border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-red-500 focus:shadow focus:shadow-red-900/40";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Background glow blobs */}
      <div
        className="absolute top-[-120px] left-[-120px] w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #e5163a, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-100px] right-[-100px] w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #e5163a, transparent 70%)",
        }}
      />

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes successPop {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Card */}
      <div
        className="relative w-full max-w-md rounded-2xl px-8 py-10 flex flex-col gap-5"
        style={{
          background: "rgba(14,14,14,0.85)",
          border: "1px solid #2a2a2a",
          backdropFilter: "blur(20px)",
          animation: "cardIn 0.5s ease",
          boxShadow: "0 0 60px rgba(229,22,58,0.07)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <img src={Logo} alt="Logo" className="h-10 object-cover" />
          <span className="font-serif text-xl font-bold tracking-wide">
            ANIME<span className="text-red-600">VERSE</span>
          </span>
        </div>

        {/* Success State */}
        {success ? (
          <div
            className="flex flex-col items-center text-center gap-4 py-6"
            style={{ animation: "successPop 0.4s ease" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{
                background: "rgba(229,22,58,0.15)",
                border: "1px solid rgba(229,22,58,0.4)",
              }}
            >
              🎉
            </div>
            <h2 className="text-xl font-bold text-white">
              Welcome back, {displayName.trim()}!
            </h2>
            <p className="text-gray-400 text-sm">
              Hope you're ready for another anime marathon.
            </p>
            <p className="text-gray-600 text-xs">Redirecting you home...</p>
          </div>
        ) : loading ? (
          /* Loading State */
          <div className="flex flex-col items-center text-center gap-5 py-8">
            <div
              className="w-12 h-12 rounded-full border-4 border-red-600 border-t-transparent"
              style={{ animation: "spin 0.8s linear infinite" }}
            />
            <p className="text-gray-400 text-sm">{loadingMsg}</p>
          </div>
        ) : (
          <>
            {/* Heading */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
              <p className="text-gray-500 text-sm mt-1">
                Continue your anime journey.
              </p>
            </div>

            {/* Social Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleGoogle}
                className="flex items-center justify-center gap-3 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 active:scale-95 cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid #2a2a2a",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#e5163a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#2a2a2a")
                }
              >
                <FaGoogle size={16} className="text-red-500" />
                Continue with Google
              </button>

              <button
                onClick={handleGithub}
                className="flex items-center justify-center gap-3 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 active:scale-95 cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid #2a2a2a",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#e5163a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#2a2a2a")
                }
              >
                <FaGithub size={16} />
                Continue with GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#2a2a2a]" />
              <span className="text-gray-600 text-xs">OR</span>
              <div className="flex-1 h-px bg-[#2a2a2a]" />
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-4">
              {/* Display Name */}
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Display Name"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    setErrors((p) => ({ ...p, displayName: "" }));
                  }}
                  className={`${inputBase} ${errors.displayName ? "border-red-500" : "border-[#2a2a2a]"}`}
                />
                {errors.displayName && (
                  <p className="text-red-400 text-xs pl-1">
                    {errors.displayName}
                  </p>
                )}
              </div>

              {/* Username */}
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors((p) => ({ ...p, username: "" }));
                  }}
                  className={`${inputBase} ${errors.username ? "border-red-500" : "border-[#2a2a2a]"}`}
                />
                {errors.username && (
                  <p className="text-red-400 text-xs pl-1">{errors.username}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((p) => ({ ...p, password: "" }));
                    }}
                    className={`${inputBase} pr-11 ${errors.password ? "border-red-500" : "border-[#2a2a2a]"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {showPass ? (
                      <MdVisibilityOff size={18} />
                    ) : (
                      <MdVisibility size={18} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs pl-1">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 active:scale-95 cursor-pointer"
              style={{ background: "#E5163A" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#c41130")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#E5163A")
              }
            >
              Sign In
            </button>

            <p className="text-center text-gray-600 text-xs">
              More features coming after Firebase Authentication is added.
            </p>
          </>
        )}
      </div>

      {toast && <Toast message={toast} />}
    </div>
  );
};

export default SignIn;
