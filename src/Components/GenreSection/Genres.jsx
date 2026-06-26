import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GiCrossedSwords,
  GiBroadsword,
  GiFairyWand,
  GiGhost,
  GiRose,
  GiSoccerBall,
  GiDramaMasks,
} from "react-icons/gi";
import { FaLaughBeam, FaRocket, FaSearch, FaHatWizard } from "react-icons/fa";

const iconMap = {
  Action: <GiCrossedSwords />,
  Adventure: <GiBroadsword />,
  Comedy: <FaLaughBeam />,
  Drama: <GiDramaMasks />,
  Fantasy: <GiFairyWand />,
  Horror: <GiGhost />,
  Romance: <GiRose />,
  "Sci-Fi": <FaRocket />,
  "Slice of Life": <FaHatWizard />,
  Supernatural: <FaHatWizard />,
  Sports: <GiSoccerBall />,
  Mystery: <FaSearch />,
};

const QUERY = `
query {
  GenreCollection
}
`;

const Genres = () => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: QUERY,
          }),
        });

        const result = await response.json();
        setGenres(result.data.GenreCollection);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-12 w-100 max-h-70
      bg-[#181818]/95 backdrop-blur-md border border-zinc-800 rounded-xl
      shadow-2xl shadow-red-900/20 p-4
      opacity-0 invisible
      group-hover:opacity-100 group-hover:visible
      transition-all duration-300
      z-50 pointer-events-none"
    >
      <div
        className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {genres.map((genre) => (
          <Link
            key={genre}
            to={`/genres/${genre.toLowerCase().replace(/\s+/g, "-")}`}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg
            bg-zinc-900 border border-zinc-800
            hover:bg-zinc-800 hover:border-red-600
            transition-all duration-300
            cursor-pointer active:scale-95"
          >
            <span className="text-red-500 text-lg">
              {iconMap[genre] || <FaHatWizard />}
            </span>

            <span className="text-sm font-medium">{genre}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Genres;
