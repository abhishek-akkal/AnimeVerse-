import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdPlayArrow, MdBookmark, MdPlaylistAdd } from "react-icons/md";

const TRENDING_PAGE_QUERY = `
  query ($page: Int) {
    Page(page: $page, perPage: 50) {
      pageInfo {
        hasNextPage
      }
      media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
        id
        title { english romaji }
        coverImage { large }
        averageScore
        episodes
        genres
        description(asHtml: false)
      }
    }
  }
`;

const CardSkeleton = () => (
  <div className="w-full flex flex-col">
    <div
      className="w-full rounded-none bg-[#1a1a1a] animate-pulse"
      style={{ height: "21rem" }}
    />
    <div className="pt-3 pb-1 flex flex-col gap-2">
      <div className="h-3 w-4/5 rounded bg-[#1a1a1a] animate-pulse" />
      <div className="h-2.5 w-1/2 rounded bg-[#1a1a1a] animate-pulse" />
    </div>
  </div>
);

const AnimeCard = ({ anime }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => navigate(`/anime/${anime.id}`)}
      className="w-full shrink-0 cursor-pointer group"
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

const HeroTrendingAni = () => {
  const [animeData, setAnimeData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrending = async (pageNum) => {
    try {
      pageNum === 1 ? setInitialLoading(true) : setLoading(true);

      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: TRENDING_PAGE_QUERY,
          variables: { page: pageNum },
        }),
      });

      if (!response.ok) throw new Error("Network error");

      const result = await response.json();
      const { media, pageInfo } = result.data.Page;

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

      setAnimeData((prev) =>
        pageNum === 1 ? formatted : [...prev, ...formatted],
      );
      setHasMore(pageInfo.hasNextPage);
    } catch (err) {
      setError("Failed to load trending anime. Please try again.");
      console.error(err);
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending(1);
  }, []);

  const handleViewMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTrending(nextPage);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <p className="text-red-400 text-sm font-semibold">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setInitialLoading(true);
            fetchTrending(1);
          }}
          className="border border-red-600 hover:bg-red-600 text-white px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 active:scale-95 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 pt-8 pb-12">
      <h1 className="text-3xl font-bold text-white mb-8">Trending Anime</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {initialLoading
          ? Array.from({ length: 20 }).map((_, i) => <CardSkeleton key={i} />)
          : animeData.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
      </div>

      {!initialLoading && (
        <div className="flex flex-col items-center mt-12 gap-3">
          {hasMore ? (
            <button
              onClick={handleViewMore}
              disabled={loading}
              className="border border-red-600 hover:bg-red-600 text-white px-8 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border-2 border-white border-t-transparent inline-block"
                    style={{ animation: "spin 0.7s linear infinite" }}
                  />
                  Loading...
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </span>
              ) : (
                "View More"
              )}
            </button>
          ) : (
            <p className="text-gray-500 text-sm">You've reached the end.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HeroTrendingAni;
