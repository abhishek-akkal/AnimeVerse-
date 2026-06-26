import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  MdPlayArrow,
  MdBookmark,
  MdPlaylistAdd,
  MdSearchOff,
} from "react-icons/md";

const SEARCH_QUERY = `
  query ($search: String) {
    Page(page: 1, perPage: 50) {
      media(type: ANIME, search: $search, isAdult: false, sort: SEARCH_MATCH) {
        id
        title { english romaji }
        episodes
        averageScore
        genres
        description(asHtml: false)
        coverImage { large }
      }
    }
  }
`;

const CARDS_PER_ROW = 5;

const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size)
    chunks.push(arr.slice(i, i + size));
  return chunks;
};

const SkeletonCard = () => (
  <div className="w-full min-w-[14.25rem] lg:min-w-0 shrink-0">
    <div
      className="w-full animate-pulse bg-zinc-800"
      style={{ height: "21rem" }}
    />
    <div className="pt-3 pb-1">
      <div className="h-4 w-4/5 animate-pulse bg-zinc-800 rounded" />
      <div className="h-3 w-2/5 animate-pulse bg-zinc-800 rounded mt-2" />
    </div>
  </div>
);

const AnimeCard = ({ anime }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => navigate(`/anime/${anime.id}`)}
      className="w-full min-w-[14.25rem] lg:min-w-0 shrink-0 cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden" style={{ height: "21rem" }}>
        <img
          src={anime.image}
          alt={anime.title}
          className="w-full h-full object-cover"
          style={{
            transition: "transform 0.5s ease",
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}
        />

        <div
          className="absolute inset-0 flex flex-col justify-between p-4"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.5) 100%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.35s ease",
            pointerEvents: hovered ? "auto" : "none",
          }}
        >
          <div className="flex justify-end">
            <span
              className="text-xs font-semibold px-2 py-1"
              style={{
                background: "rgba(250,180,0,0.18)",
                color: "#FACC15",
                border: "1px solid rgba(250,180,0,0.3)",
              }}
            >
              ★ {anime.rating}
            </span>
          </div>

          <div
            style={{
              transform: hovered ? "translateY(0)" : "translateY(12px)",
              transition: "transform 0.35s ease, opacity 0.35s ease",
              opacity: hovered ? 1 : 0,
            }}
          >
            <h3 className="font-bold text-base text-white leading-tight mb-1">
              {anime.title}
            </h3>

            <p className="text-xs text-gray-400 mb-2">{anime.episodes}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {anime.genres.map((g) => (
                <span
                  key={g}
                  className="text-xs px-2 py-0.5"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    color: "#d1d5db",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {g}
                </span>
              ))}
            </div>

            <p
              className="text-xs text-gray-300 leading-relaxed mb-4"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {anime.description}
            </p>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/anime/${anime.id}`);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 flex-1 justify-center cursor-pointer active:scale-95"
                style={{
                  background: "#E5163A",
                  color: "white",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#c41130")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#E5163A")
                }
              >
                <MdPlayArrow size={16} />
                Watch
              </button>

              <button
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center w-9 h-9 cursor-pointer active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.15)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                }
                title="Bookmark"
              >
                <MdBookmark size={16} />
              </button>

              <button
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center w-9 h-9 cursor-pointer active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.15)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                }
                title="Add to List"
              >
                <MdPlaylistAdd size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 pb-1">
        <h3 className="font-bold text-sm text-white leading-tight truncate">
          {anime.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">{anime.episodes}</p>
      </div>
    </div>
  );
};

const Pages = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        setResults([]);

        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: SEARCH_QUERY,
            variables: { search: query.trim() },
          }),
        });

        if (!response.ok) throw new Error("Network error");

        const result = await response.json();
        const media = result.data.Page.media;

        const formatted = media.map((anime) => ({
          id: anime.id,
          title: anime.title.english || anime.title.romaji,
          episodes: anime.episodes ? `${anime.episodes} Episodes` : "Ongoing",
          rating: anime.averageScore
            ? (anime.averageScore / 10).toFixed(1)
            : "N/A",
          image: anime.coverImage.large,
          description: anime.description
            ? anime.description.replace(/<[^>]*>/g, "")
            : "No description available.",
          genres: anime.genres,
        }));

        setResults(formatted);
      } catch (err) {
        setError(true);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const displayQuery = query.charAt(0).toUpperCase() + query.slice(1);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="px-5 pt-8 pb-12">
        <h1 className="text-3xl font-bold text-white mb-1">Search Results</h1>
        <p className="text-gray-400 text-sm mb-8">
          Searching for:{" "}
          <span className="text-red-400 font-semibold">{displayQuery}</span>
        </p>

        {/* Desktop skeleton */}
        <div className="hidden lg:grid grid-cols-5 gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        {/* Mobile/tablet skeleton rows */}
        <div className="flex flex-col gap-6 lg:hidden">
          {Array.from({ length: 4 }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex gap-6 overflow-x-auto pb-3"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {Array.from({ length: CARDS_PER_ROW }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 px-6 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
          style={{
            background: "rgba(229,22,58,0.1)",
            border: "1px solid rgba(229,22,58,0.3)",
          }}
        >
          <MdSearchOff size={32} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-white">Something went wrong</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          We couldn't complete your search right now. Please check your
          connection and try again.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 border border-red-600 hover:bg-red-600 text-white px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 active:scale-95 cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    );
  }

  /* ── Empty ── */
  if (!loading && results.length === 0 && query) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 px-6 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid #2a2a2a",
          }}
        >
          <MdSearchOff size={40} className="text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-white">No anime found</h2>
        <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
          We couldn't find anything matching{" "}
          <span className="text-red-400 font-semibold">"{displayQuery}"</span>.
          <br />
          Try searching with another title.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-3 border border-red-600 hover:bg-red-600 text-white px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 active:scale-95 cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    );
  }

  /* ── Results ── */
  const rows = chunkArray(results, CARDS_PER_ROW);

  return (
    <div className="px-5 pt-8 pb-12">
      <h1 className="text-3xl font-bold text-white mb-1">Search Results</h1>
      <p className="text-gray-400 text-sm mb-8">
        Showing results for:{" "}
        <span className="text-red-400 font-semibold">{displayQuery}</span>
      </p>

      {/* ── Desktop: 5-col grid ── */}
      <div className="hidden lg:grid grid-cols-5 gap-6">
        {results.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>

      {/* ── Mobile / Tablet: rows of 5, each independently scrollable ── */}
      <div className="flex flex-col gap-6 lg:hidden">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-3"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {row.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pages;
