import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdChevronLeft,
  MdChevronRight,
  MdPlayArrow,
  MdBookmark,
  MdPlaylistAdd,
} from "react-icons/md";

const TRENDING_QUERY = `
  query {
    Page(page: 1, perPage: 20) {
      media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
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

const SkeletonCard = () => (
  <div className="w-57 shrink-0 pl-1">
    {/* Image placeholder */}
    <div
      className="w-full animate-pulse bg-zinc-800"
      style={{ height: "21rem" }}
    />
    {/* Title placeholder */}
    <div className="pt-3 pb-1">
      <div className="h-4 w-4/5 animate-pulse bg-zinc-800 rounded" />
      {/* Episodes placeholder */}
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
      className="w-57 shrink-0 pl-1 cursor-pointer group"
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
          {anime.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">{anime.episodes}</p>
      </div>
    </div>
  );
};

const TrendingAnimes = () => {
  const scrollRef = useRef(null);
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: TRENDING_QUERY }),
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();

        const formatted = result.data.Page.media.map((anime) => ({
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

        setAnimeData(formatted);
      } catch (err) {
        setError("Failed to load trending anime.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -700, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 700, behavior: "smooth" });
  };

  return (
    <section className="max-w-[1230px] pt-5 overflow-hidden">
      <div className="flex items-center justify-between mb-5 px-5">
        <h2 className="text-3xl font-bold">Trending Anime</h2>

        <div className="flex gap-3">
          <button
            onClick={scrollLeft}
            className="w-11 h-11 rounded-full bg-zinc-900 hover:bg-red-600 transition flex items-center justify-center cursor-pointer active:scale-95"
          >
            <MdChevronLeft size={26} />
          </button>

          <button
            onClick={scrollRight}
            className="w-11 h-11 rounded-full bg-zinc-900 hover:bg-red-600 transition flex items-center justify-center cursor-pointer active:scale-95"
          >
            <MdChevronRight size={26} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-3"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading &&
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}

          {error && <p className="text-red-400 text-sm px-5 py-10">{error}</p>}

          {!loading &&
            !error &&
            animeData.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingAnimes;
