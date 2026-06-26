import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdPlayArrow,
  MdBookmark,
  MdFavorite,
  MdPlaylistAdd,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

const ANIME_DETAILS_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title { english romaji native }
      bannerImage
      coverImage { extraLarge large }
      description(asHtml: false)
      genres
      averageScore
      popularity
      favourites
      trending
      rankings { rank type allTime season context }
      episodes
      duration
      status
      season
      seasonYear
      source
      trailer { id site }
      tags { name rank }
      studios { nodes { name isAnimationStudio } }
      characters(sort: ROLE, perPage: 12) {
        edges {
          node { id name { full } image { medium } }
          role
          voiceActors(language: JAPANESE) {
            id name { full } image { medium }
          }
        }
      }
      relations {
        edges {
          relationType
          node {
            id title { english romaji }
            coverImage { large }
            type format
            averageScore
            episodes
            genres
            description(asHtml: false)
          }
        }
      }
      recommendations(perPage: 10) {
        nodes {
          mediaRecommendation {
            id title { english romaji }
            coverImage { large }
            averageScore
            episodes
            genres
            description(asHtml: false)
          }
        }
      }
    }
  }
`;

const AnimeCard = ({ anime, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="w-44 shrink-0 cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className="relative overflow-hidden" style={{ height: "16rem" }}>
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
          className="absolute inset-0 flex flex-col justify-between p-3"
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
            <h3 className="font-bold text-sm text-white leading-tight mb-1 line-clamp-2">
              {anime.title}
            </h3>
            <p className="text-xs text-gray-400 mb-2">{anime.episodes}</p>
            <div className="flex flex-wrap gap-1">
              {anime.genres?.slice(0, 2).map((g) => (
                <span
                  key={g}
                  className="text-xs px-1.5 py-0.5"
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
          </div>
        </div>
      </div>
      <div className="pt-2 pb-1">
        <h3 className="font-bold text-xs text-white leading-tight truncate">
          {anime.title}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{anime.episodes}</p>
      </div>
    </div>
  );
};

const ScrollRow = ({ title, children }) => {
  const ref = useRef(null);
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-5">{title}</h2>
      <div className="relative">
        <button
          onClick={() =>
            ref.current?.scrollBy({ left: -600, behavior: "smooth" })
          }
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-zinc-900 hover:bg-red-600 transition flex items-center justify-center -translate-x-1"
        >
          <MdChevronLeft size={22} />
        </button>
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {children}
        </div>
        <button
          onClick={() =>
            ref.current?.scrollBy({ left: 600, behavior: "smooth" })
          }
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-zinc-900 hover:bg-red-600 transition flex items-center justify-center translate-x-1"
        >
          <MdChevronRight size={22} />
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div
    className="flex flex-col items-center justify-center px-6 py-4 rounded-lg"
    style={{ background: "#161616", border: "1px solid #2a2a2a" }}
  >
    <span className="text-2xl font-bold text-white">{value ?? "—"}</span>
    <span className="text-xs text-gray-400 mt-1">{label}</span>
  </div>
);

const AnimeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        setAnime(null);
        setDescExpanded(false);

        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: ANIME_DETAILS_QUERY,
            variables: { id: parseInt(id) },
          }),
        });

        if (!response.ok) throw new Error("Network error");

        const result = await response.json();
        setAnime(result.data.Media);
      } catch (err) {
        setError("Failed to load anime details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div
          className="w-12 h-12 rounded-full border-4 border-red-600 border-t-transparent"
          style={{ animation: "spin 0.8s linear infinite" }}
        />
        <p className="text-gray-400 text-sm">Loading anime details...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <p className="text-red-400 text-lg font-semibold">
          Something went wrong
        </p>
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 border border-red-600 hover:bg-red-600 text-white px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 active:scale-95 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!anime) return null;

  const title = anime.title.english || anime.title.romaji || anime.title.native;
  const studio = anime.studios?.nodes?.find((s) => s.isAnimationStudio)?.name;
  const overallRank = anime.rankings?.find(
    (r) => r.allTime && r.type === "RATED",
  )?.rank;
  const description = anime.description?.replace(/<[^>]*>/g, "") ?? "";
  const shortDesc = description.slice(0, 400);
  const isLong = description.length > 400;

  const relations =
    anime.relations?.edges
      ?.filter((e) => e.node.type === "ANIME")
      .map((e) => ({
        id: e.node.id,
        title: e.node.title.english || e.node.title.romaji,
        image: e.node.coverImage.large,
        rating: e.node.averageScore
          ? (e.node.averageScore / 10).toFixed(1)
          : "N/A",
        episodes: e.node.episodes ? `${e.node.episodes} Episodes` : "Ongoing",
        genres: e.node.genres,
        description: e.node.description?.replace(/<[^>]*>/g, "") ?? "",
        relationType: e.relationType,
      })) ?? [];

  const recommendations =
    anime.recommendations?.nodes
      ?.filter((n) => n.mediaRecommendation)
      .map((n) => ({
        id: n.mediaRecommendation.id,
        title:
          n.mediaRecommendation.title.english ||
          n.mediaRecommendation.title.romaji,
        image: n.mediaRecommendation.coverImage.large,
        rating: n.mediaRecommendation.averageScore
          ? (n.mediaRecommendation.averageScore / 10).toFixed(1)
          : "N/A",
        episodes: n.mediaRecommendation.episodes
          ? `${n.mediaRecommendation.episodes} Episodes`
          : "Ongoing",
        genres: n.mediaRecommendation.genres,
        description:
          n.mediaRecommendation.description?.replace(/<[^>]*>/g, "") ?? "",
      })) ?? [];

  return (
    <div
      className="min-h-screen"
      style={{ opacity: 1, animation: "fadeIn 0.5s ease" }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ── Banner ── */}
      <div
        className="relative w-full"
        style={{ height: "480px", overflow: "hidden" }}
      >
        {anime.bannerImage ? (
          <img
            src={anime.bannerImage}
            alt={title}
            className="w-full h-full object-cover"
            style={{ filter: "blur(1px) brightness(0.55)" }}
          />
        ) : (
          <div className="w-full h-full" style={{ background: "#0e0e0e" }} />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #000 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Main Content ── */}
      <div
        className="px-6 md:px-10 pb-16"
        style={{ marginTop: "-220px", position: "relative", zIndex: 10 }}
      >
        {/* Poster + Info */}
        <div
          className="flex flex-col md:flex-row gap-8 mb-10"
          style={{ animation: "slideUp 0.6s ease" }}
        >
          {/* Poster */}
          <div className="shrink-0">
            <img
              src={anime.coverImage.extraLarge || anime.coverImage.large}
              alt={title}
              className="rounded-xl object-cover shadow-2xl"
              style={{
                width: "200px",
                height: "290px",
                border: "3px solid #2a2a2a",
                transition: "transform 0.4s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-end gap-3 flex-1">
            <h1 className="text-4xl font-bold text-white leading-tight">
              {title}
            </h1>
            {anime.title.romaji && anime.title.romaji !== title && (
              <p className="text-gray-400 text-sm">{anime.title.romaji}</p>
            )}
            {anime.title.native && (
              <p className="text-gray-500 text-sm">{anime.title.native}</p>
            )}

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mt-1">
              {anime.genres?.map((g) => (
                <span
                  key={g}
                  className="text-xs font-semibold px-3 py-1 rounded-full cursor-pointer transition-all duration-200"
                  style={{
                    background: "rgba(229,22,58,0.15)",
                    color: "#f87171",
                    border: "1px solid rgba(229,22,58,0.4)",
                  }}
                  onClick={() => navigate(`/genres/${g.toLowerCase()}`)}
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2 mt-2 text-sm">
              {[
                [
                  "Rating",
                  anime.averageScore
                    ? `⭐ ${(anime.averageScore / 10).toFixed(1)} / 10`
                    : "N/A",
                ],
                ["Episodes", anime.episodes ?? "Ongoing"],
                [
                  "Duration",
                  anime.duration ? `${anime.duration} min/ep` : "N/A",
                ],
                ["Status", anime.status?.replace(/_/g, " ") ?? "N/A"],
                [
                  "Season",
                  anime.season
                    ? `${anime.season} ${anime.seasonYear ?? ""}`
                    : "N/A",
                ],
                ["Source", anime.source?.replace(/_/g, " ") ?? "N/A"],
                ["Studio", studio ?? "N/A"],
                ["Rank", overallRank ? `#${overallRank}` : "N/A"],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col">
                  <span className="text-gray-500 text-xs uppercase tracking-wide">
                    {label}
                  </span>
                  <span className="text-white font-semibold">{value}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-4">
              {anime.trailer?.site === "youtube" && (
                <a
                  href={`https://www.youtube.com/watch?v=${anime.trailer.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 active:scale-95 cursor-pointer"
                  style={{ background: "#E5163A", color: "white" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#c41130")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#E5163A")
                  }
                >
                  <MdPlayArrow size={20} />
                  Watch Trailer
                </a>
              )}

              <button
                onClick={() => setFavorited((v) => !v)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 active:scale-95 cursor-pointer"
                style={{
                  background: favorited
                    ? "rgba(229,22,58,0.2)"
                    : "rgba(255,255,255,0.07)",
                  color: favorited ? "#f87171" : "white",
                  border: `1px solid ${favorited ? "rgba(229,22,58,0.5)" : "rgba(255,255,255,0.15)"}`,
                }}
              >
                <MdFavorite size={18} />
                {favorited ? "Favorited" : "Favorite"}
              </button>

              <button
                onClick={() => setBookmarked((v) => !v)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 active:scale-95 cursor-pointer"
                style={{
                  background: bookmarked
                    ? "rgba(229,22,58,0.2)"
                    : "rgba(255,255,255,0.07)",
                  color: bookmarked ? "#f87171" : "white",
                  border: `1px solid ${bookmarked ? "rgba(229,22,58,0.5)" : "rgba(255,255,255,0.15)"}`,
                }}
              >
                <MdBookmark size={18} />
                {bookmarked ? "Saved" : "Watchlist"}
              </button>

              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 active:scale-95 cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
                }
              >
                <MdPlaylistAdd size={18} />
                Add to List
              </button>
            </div>
          </div>
        </div>

        {/* ── Description ── */}
        {description && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
            <div
              className="rounded-xl p-5 text-gray-300 text-sm leading-relaxed"
              style={{ background: "#111", border: "1px solid #2a2a2a" }}
            >
              <p>{descExpanded || !isLong ? description : `${shortDesc}...`}</p>
              {isLong && (
                <button
                  onClick={() => setDescExpanded((v) => !v)}
                  className="mt-3 text-red-400 text-xs font-semibold hover:text-red-300 transition-colors cursor-pointer"
                >
                  {descExpanded ? "Show Less ▲" : "Read More ▼"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Statistics ── */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-5">Statistics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <StatCard
              label="Average Score"
              value={
                anime.averageScore
                  ? `${(anime.averageScore / 10).toFixed(1)}/10`
                  : "N/A"
              }
            />
            <StatCard
              label="Popularity"
              value={anime.popularity?.toLocaleString()}
            />
            <StatCard
              label="Favourites"
              value={anime.favourites?.toLocaleString()}
            />
            <StatCard
              label="Trending"
              value={anime.trending ? `#${anime.trending}` : "N/A"}
            />
            <StatCard
              label="Global Rank"
              value={overallRank ? `#${overallRank}` : "N/A"}
            />
          </div>
        </div>

        {/* ── Trailer ── */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-5">Trailer</h2>
          {anime.trailer?.site === "youtube" ? (
            <div
              className="rounded-xl overflow-hidden"
              style={{ maxWidth: "720px", aspectRatio: "16/9" }}
            >
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                title="Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ display: "block" }}
              />
            </div>
          ) : (
            <div
              className="rounded-xl flex items-center justify-center py-14"
              style={{
                background: "#111",
                border: "1px solid #2a2a2a",
                maxWidth: "720px",
              }}
            >
              <p className="text-gray-500 text-sm">Trailer not available.</p>
            </div>
          )}
        </div>

        {/* ── Characters ── */}
        {anime.characters?.edges?.length > 0 && (
          <ScrollRow title="Characters">
            {anime.characters.edges.map((edge) => {
              const va = edge.voiceActors?.[0];
              return (
                <div
                  key={edge.node.id}
                  className="shrink-0 w-28 flex flex-col items-center text-center"
                >
                  <img
                    src={edge.node.image.medium}
                    alt={edge.node.name.full}
                    className="w-20 h-20 rounded-full object-cover mb-2"
                    style={{ border: "2px solid #2a2a2a" }}
                  />
                  <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
                    {edge.node.name.full}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">{edge.role}</p>
                  {va && (
                    <>
                      <img
                        src={va.image.medium}
                        alt={va.name.full}
                        className="w-12 h-12 rounded-full object-cover mt-2 mb-1"
                        style={{ border: "2px solid #1e1e1e" }}
                      />
                      <p className="text-gray-400 text-xs line-clamp-1">
                        {va.name.full}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </ScrollRow>
        )}

        {/* ── Relations ── */}
        {relations.length > 0 && (
          <ScrollRow title="Related Anime">
            {relations.map((rel) => (
              <div key={rel.id} className="relative">
                <span
                  className="absolute top-2 left-2 z-10 text-xs font-semibold px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(229,22,58,0.85)",
                    color: "white",
                  }}
                >
                  {rel.relationType?.replace(/_/g, " ")}
                </span>
                <AnimeCard
                  anime={rel}
                  onClick={() => navigate(`/anime/${rel.id}`)}
                />
              </div>
            ))}
          </ScrollRow>
        )}

        {/* ── Recommendations ── */}
        {recommendations.length > 0 && (
          <ScrollRow title="Recommendations">
            {recommendations.map((rec) => (
              <AnimeCard
                key={rec.id}
                anime={rec}
                onClick={() => navigate(`/anime/${rec.id}`)}
              />
            ))}
          </ScrollRow>
        )}

        {/* ── Tags ── */}
        {anime.tags?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-5">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {anime.tags.map((tag) => (
                <span
                  key={tag.name}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "#9ca3af",
                    border: "1px solid #2a2a2a",
                  }}
                >
                  {tag.name}
                  <span className="text-gray-600 ml-1">{tag.rank}%</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeDetails;
