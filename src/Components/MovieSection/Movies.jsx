import { useState, useEffect, useCallback } from "react";
import {
  MdPlayArrow,
  MdBookmark,
  MdPlaylistAdd,
  MdRefresh,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

const MOVIES_QUERY = `
  query ($page: Int) {
    Page(page: $page, perPage: 50) {
      pageInfo {
        hasNextPage
      }
      media(type: ANIME, format: MOVIE, sort: POPULARITY_DESC, isAdult: false) {
        id
        title { english romaji }
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

// ─── Skeleton Card ────────────────────────────────────────────────────────────
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

// ─── Error State ──────────────────────────────────────────────────────────────
const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-32">
    <p className="text-red-400 text-sm">{message}</p>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 text-xs font-semibold px-4 py-2 cursor-pointer active:scale-95 transition"
      style={{ background: "#E5163A", color: "white" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#c41130")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#E5163A")}
    >
      <MdRefresh size={15} />
      Try Again
    </button>
  </div>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg
    className="animate-spin"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);

// ─── Movie Card ───────────────────────────────────────────────────────────────
const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => navigate(`/anime/${movie.id}`)}
      className="w-full min-w-[14.25rem] lg:min-w-0 shrink-0 cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden" style={{ height: "21rem" }}>
        <img
          src={movie.image}
          alt={movie.title}
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
              ★ {movie.rating}
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
              {movie.title}
            </h3>

            <p className="text-xs text-gray-400 mb-2">{movie.episodes}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {movie.genres.map((g) => (
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
              {movie.description}
            </p>

            <div className="flex gap-2">
              <button
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
          {movie.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">{movie.episodes}</p>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const Movies = () => {
  const [movieData, setMovieData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async (pageNum) => {
    try {
      pageNum === 1 ? setInitialLoading(true) : setLoading(true);
      setError(null);

      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: MOVIES_QUERY,
          variables: { page: pageNum },
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();
      const { media, pageInfo } = result.data.Page;

      const formatted = media.map((movie) => ({
        id: movie.id,
        title: movie.title.english || movie.title.romaji,
        episodes: "Movie",
        rating: movie.averageScore
          ? (movie.averageScore / 10).toFixed(1)
          : "N/A",
        image: movie.coverImage.large,
        description: movie.description
          ? movie.description.replace(/<[^>]*>/g, "")
          : "No description available.",
        genres: movie.genres,
      }));

      setMovieData((prev) =>
        pageNum === 1 ? formatted : [...prev, ...formatted],
      );
      setHasMore(pageInfo.hasNextPage);
    } catch (err) {
      setError("Failed to load movies.");
      console.error(err);
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies(1);
  }, [fetchMovies]);

  const handleRetry = () => {
    setMovieData([]);
    setPage(1);
    fetchMovies(1);
  };

  const handleViewMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(nextPage);
  };

  // ── Initial skeleton ───────────────────────────────────────────────────────
  if (initialLoading) {
    return (
      <div className="px-5 pt-8 pb-12">
        <h1 className="text-3xl font-bold text-white mb-8">Movies</h1>

        {/* Desktop: flat grid of skeleton cards */}
        <div className="hidden lg:grid grid-cols-5 gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        {/* Mobile/tablet: skeleton rows, each independently scrollable */}
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

  // ── Full-page error (no data loaded yet) ──────────────────────────────────
  if (error && movieData.length === 0) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  const rows = chunkArray(movieData, CARDS_PER_ROW);

  return (
    <div className="px-5 pt-8 pb-12">
      <h1 className="text-3xl font-bold text-white mb-8">Movies</h1>

      {/* ── Desktop: original CSS grid, completely unchanged ── */}
      <div className="hidden lg:grid grid-cols-5 gap-6">
        {movieData.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* ── Mobile / tablet: one scrollable strip per row of 5 ── */}
      <div className="flex flex-col gap-6 lg:hidden">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-3"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {row.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ))}
      </div>

      {/* ── View More / end ── */}
      <div className="flex flex-col items-center mt-12 gap-3">
        {hasMore ? (
          <button
            onClick={handleViewMore}
            disabled={loading}
            className="flex items-center justify-center gap-2 border border-red-600 hover:bg-red-600 text-white px-8 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minWidth: "140px" }}
          >
            {loading ? (
              <>
                <Spinner />
                Loading...
              </>
            ) : (
              "View More"
            )}
          </button>
        ) : (
          <p className="text-gray-500 text-sm">You've reached the end.</p>
        )}
      </div>
    </div>
  );
};

export default Movies;
