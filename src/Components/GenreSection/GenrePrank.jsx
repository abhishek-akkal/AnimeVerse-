import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const GenrePrank = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <div
        className="text-8xl mb-6"
        style={{ animation: "bounce 1s infinite" }}
      >
        😏
      </div>

      <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
        Naughty...
        <br />
        <span className="text-red-500">I knew you'd click this.</span>
      </h1>

      <p className="text-gray-400 text-base max-w-md mb-3">
        Unfortunately there aren't any{" "}
        <span className="text-yellow-400 font-semibold">"cultured"</span> anime
        here.
      </p>

      <p className="text-gray-500 text-sm max-w-sm mb-10">
        This is a family-friendly zone. AnimeVerse cares about your soul. 🙏
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 active:scale-95 cursor-pointer"
        >
          Back to Home
        </button>

        <button
          onClick={() => navigate("/animes")}
          className="border border-red-600 hover:bg-red-600 text-white px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 active:scale-95 cursor-pointer"
        >
          Watch Real Anime Instead
        </button>
      </div>

      <p className="text-gray-500 text-sm mt-10 ">
        (🤫 We won't tell anyone you clicked it... so don't worry. 😉)
      </p>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
};

export default GenrePrank;
