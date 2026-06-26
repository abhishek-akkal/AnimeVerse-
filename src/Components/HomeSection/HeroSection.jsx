import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import HeroData from "../Data/HeroData";
import { FaPlay, FaPlus } from "react-icons/fa";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import HeroRight from "./HeroRight";

const HERO_QUERY = `
  query ($search: String) {
    Media(type: ANIME, search: $search) {
      id
      title { english romaji }
      averageScore
      genres
      episodes
      startDate { year }
      description(asHtml: false)
      bannerImage
      coverImage { extraLarge }
    }
  }
`;

const HeroSection = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          HeroData.map((item) =>
            fetch("https://graphql.anilist.co", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                query: HERO_QUERY,
                variables: { search: item.search },
              }),
            })
              .then((r) => r.json())
              .then((r) => r.data.Media),
          ),
        );

        const formatted = results.map((media, i) => ({
          id: media.id,
          tag: HeroData[i].tag,
          image: HeroData[i].image,
          mobileBg:
            media.bannerImage ||
            media.coverImage?.extraLarge ||
            HeroData[i].image,
          title: (
            media.title.english ||
            media.title.romaji ||
            HeroData[i].search
          ).toUpperCase(),
          rating: media.averageScore
            ? (media.averageScore / 10).toFixed(1)
            : "N/A",
          genre: media.genres?.slice(0, 2).join(" • ") ?? "",
          episodes: media.episodes ? `${media.episodes} Episodes` : "Ongoing",
          year: media.startDate?.year ?? "",
          description: media.description
            ? media.description.replace(/<[^>]*>/g, "").slice(0, 200) + "..."
            : "No description available.",
        }));

        setApiData(formatted);
      } catch (err) {
        setError("Failed to load hero data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? HeroData.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev === HeroData.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [handleNext]);

  const anime = apiData[current];
  const bg = HeroData[current].image;
  const mobileBg = anime?.mobileBg || bg;

  /* ─────────────────────────────────────────────
     SHARED SKELETON  (same for both breakpoints)
  ───────────────────────────────────────────── */
  const SkeletonContent = () => (
    <div className="flex flex-col gap-3">
      <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
      <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
      <div className="h-3 w-36 bg-white/10 rounded animate-pulse" />
      <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
      <div className="h-3 w-4/5 bg-white/10 rounded animate-pulse" />
      <div className="flex gap-3 mt-2">
        <div className="h-9 w-28 bg-white/10 rounded animate-pulse" />
        <div className="h-9 w-24 bg-white/10 rounded animate-pulse" />
      </div>
    </div>
  );

  /* ─────────────────────────────────────────────
     SHARED DOT + ARROW CONTROLS
  ───────────────────────────────────────────── */
  const Dots = () => (
    <div className="flex gap-2 mt-5">
      {HeroData.map((_, i) => (
        <span
          key={i}
          onClick={() => setCurrent(i)}
          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
            i === current
              ? "w-5 bg-red-500"
              : "w-1.5 bg-gray-600 hover:bg-gray-400"
          }`}
        />
      ))}
    </div>
  );

  const Arrows = ({ position = "bottom-4 right-4" }) => (
    <div className={`absolute ${position} z-10 flex gap-3`}>
      <button
        onClick={handlePrev}
        className="w-9 h-9 rounded-full border border-white/20 bg-black/50 hover:bg-red-600 hover:border-red-600 text-white flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer"
      >
        <MdChevronLeft className="text-xl" />
      </button>
      <button
        onClick={handleNext}
        className="w-9 h-9 rounded-full border border-white/20 bg-black/50 hover:bg-red-600 hover:border-red-600 text-white flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer"
      >
        <MdChevronRight className="text-xl" />
      </button>
    </div>
  );

  return (
    <>
      {/* ═══════════════════════════════════════════════
          DESKTOP  (lg and above) — pixel-perfect same
      ═══════════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-1">
        <div
          className="relative flex-1 h-130 flex flex-col justify-end px-10 py-20"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          <div className="relative z-10 max-w-[55%]">
            {loading ? (
              <SkeletonContent />
            ) : error ? (
              <p className="text-red-400 text-sm">{error}</p>
            ) : anime ? (
              <>
                <p className="text-red-500 text-xs font-bold tracking-[3px] uppercase mb-2">
                  ● {anime.tag}
                </p>

                <h1 className="text-5xl font-black uppercase leading-tight text-white mb-2">
                  {anime.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="text-yellow-400">★ {anime.rating}</span>
                  <span>{anime.episodes}</span>
                  <span className="text-red-400">{anime.genre}</span>
                  <span>{anime.year}</span>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                  {anime.description}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/anime/${anime.id}`)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 active:scale-95 cursor-pointer"
                  >
                    <FaPlay className="text-xs" />
                    Watch Now
                  </button>

                  <button className="flex items-center gap-2 border border-white/30 hover:border-white/60 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-300 active:scale-95 cursor-pointer">
                    <FaPlus className="text-xs" />
                    My List
                  </button>
                </div>

                <Dots />
              </>
            ) : null}
          </div>

          <Arrows position="bottom-6 right-6" />
        </div>

        <HeroRight />
      </div>

      {/* ═══════════════════════════════════════════════
          MOBILE / TABLET  (below lg) — new layout
      ═══════════════════════════════════════════════ */}
      <div className="lg:hidden w-full">
        <div
          className="relative w-full flex flex-col justify-end"
          style={{ minHeight: "480px" }}
        >
          {/* API banner as background */}
          {!loading && anime && (
            <img
              src={mobileBg}
              alt={anime.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Skeleton bg while loading */}
          {loading && (
            <div className="absolute inset-0 bg-[#0e0e0e] animate-pulse" />
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

          {/* Content */}
          <div className="relative z-10 px-5 pb-10 pt-32">
            {loading ? (
              <SkeletonContent />
            ) : error ? (
              <p className="text-red-400 text-sm">{error}</p>
            ) : anime ? (
              <>
                <p className="text-red-500 text-xs font-bold tracking-[3px] uppercase mb-2">
                  ● {anime.tag}
                </p>

                <h1 className="text-2xl sm:text-3xl font-black uppercase leading-tight text-white mb-2">
                  {anime.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-3">
                  <span className="text-yellow-400">★ {anime.rating}</span>
                  <span>{anime.episodes}</span>
                  <span className="text-red-400">{anime.genre}</span>
                  <span>{anime.year}</span>
                </div>

                <p className="text-gray-400 text-xs leading-relaxed mb-5 max-w-sm line-clamp-3">
                  {anime.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`/anime/${anime.id}`)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 active:scale-95 cursor-pointer"
                  >
                    <FaPlay className="text-xs" />
                    Watch Now
                  </button>

                  <button className="flex items-center gap-2 border border-white/30 hover:border-white/60 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 active:scale-95 cursor-pointer">
                    <FaPlus className="text-xs" />
                    My List
                  </button>
                </div>

                <Dots />
              </>
            ) : null}
          </div>

          <Arrows position="bottom-4 right-4" />
        </div>
      </div>
    </>
  );
};

export default HeroSection;
