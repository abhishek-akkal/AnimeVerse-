import genreData from "../Data/GenreData";
import TrendingRight from "../../assets/HeroSection/TrendingRight.png";
import { Link } from "react-router-dom";

const Genre = () => {
  return (
    <div className="w-72 bg-[#141414] px-5 py-5">
      <h2 className="text-2xl font-bold mb-6 flex justify-center">Genres</h2>

      {/* Genres */}
      <div className="grid grid-cols-2 gap-3">
        {genreData.map((genre) => (
          <Link
            key={genre.id}
            to={`/genres/${encodeURIComponent(genre.name)}`}
            className="flex items-center gap-3 bg-[#1b1b1b] hover:bg-[#222222] border border-zinc-800 hover:border-red-600 rounded-lg px-3 py-3 transition-all duration-300 active:scale-95 group"
          >
            <span className="text-red-600 text-lg group-hover:scale-110 transition">
              {genre.icon}
            </span>

            <span className="text-xs font-medium text-white group-hover:text-red-500 transition">
              {genre.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Featured Card */}
      <div className="mt-20">
        <div className="relative h-100 rounded-xl overflow-hidden bg-zinc-900 group cursor-pointer">
          {/* Image */}
          <img
            src={TrendingRight}
            alt="Trending"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-xs uppercase tracking-[3px] text-red-500 font-semibold">
              Trending Now
            </p>

            <h3 className="text-2xl font-bold mt-2 leading-tight">
              See What's
              <br />
              Trending Today
            </h3>

            <Link to="/trending">
              <button className="mt-5 w-full py-3 border border-red-600 rounded-md font-semibold hover:bg-red-600 transition-all duration-300 active:scale-95 cursor-pointer">
                Discover
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Genre;
