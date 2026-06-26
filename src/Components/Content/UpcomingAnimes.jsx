import { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import Genre from "./Genre";
import { Link, useNavigate } from "react-router-dom";

const EXCLUDED_GENRES = ["ecchi", "hentai"];

const NEW_RELEASES_QUERY = `
  query {
    Page(page: 1, perPage: 30) {
      media(type: ANIME, sort: START_DATE_DESC, isAdult: false) {
        id
        title { english romaji }
        coverImage { large }
        bannerImage
        episodes
        averageScore
        format
        genres
      }
    }
  }
`;

const SidebarSkeleton = () => (
  <div className="flex flex-col gap-3">
    {/* Featured banner skeleton */}
    <div className="h-45 rounded-xl bg-[#2a2a2a] animate-pulse mb-1" />

    {/* List skeletons */}
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
        <div className="w-12 h-16 rounded-md bg-[#2a2a2a] animate-pulse shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-3 w-full rounded bg-[#2a2a2a] animate-pulse" />
          <div className="h-2.5 w-2/3 rounded bg-[#2a2a2a] animate-pulse" />
          <div className="h-2.5 w-1/3 rounded bg-[#2a2a2a] animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

const UpcomingAnimes = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: NEW_RELEASES_QUERY }),
        });

        if (!response.ok) throw new Error("Network error");

        const result = await response.json();

        const filtered = result.data.Page.media.filter((anime) => {
          const genres = (anime.genres || []).map((g) => g.toLowerCase());
          return !genres.some((g) => EXCLUDED_GENRES.includes(g));
        });

        const formatted = filtered.slice(0, 11).map((anime) => ({
          id: anime.id,
          title: anime.title.english || anime.title.romaji,
          ep:
            anime.format === "MOVIE"
              ? "Movie"
              : anime.episodes
                ? `${anime.episodes} Episodes`
                : "Ongoing",
          rating: anime.averageScore
            ? (anime.averageScore / 10).toFixed(1)
            : "N/A",
          img: anime.coverImage.large,
          banner: anime.bannerImage || anime.coverImage.large,
        }));

        setFeatured(formatted[0]);
        setList(formatted.slice(1));
      } catch (err) {
        setError("Failed to load upcoming anime.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  return (
    <div>
      <div className="h-282 w-72 bg-[#141414] p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Upcoming Anime</h3>

          <Link
            to="/upcoming"
            className="text-sm text-gray-400 hover:text-red-500 active:scale-95 cursor-pointer transition"
          >
            View All →
          </Link>
        </div>

        {loading && <SidebarSkeleton />}

        {error && <p className="text-red-400 text-xs px-2 py-4">{error}</p>}

        {!loading && !error && featured && (
          <>
            {/* Featured Card */}
            <div
              onClick={() => navigate(`/anime/${featured.id}`)}
              className="relative h-45 rounded-xl overflow-hidden cursor-pointer group mb-4"
            >
              <img
                src={featured.banner}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-out" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-out">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/anime/${featured.id}`);
                  }}
                  className="w-11 h-11 rounded-full bg-[#e11705] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center shadow-lg"
                >
                  <FaPlay />
                </div>
              </div>

              <div className="absolute bottom-3 left-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out">
                <p className="text-xs text-gray-300 uppercase">Featured</p>
                <h2 className="text-xl font-bold line-clamp-1">
                  {featured.title}
                </h2>
                <p className="text-yellow-400 text-sm">★ {featured.rating}</p>
              </div>
            </div>

            {/* List */}
            {list.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/anime/${item.id}`)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1b1b1b] transition cursor-pointer"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-12 h-16 rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{item.ep}</p>
                  <p className="text-xs text-yellow-400 mt-1">
                    ★ {item.rating}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <Genre />
    </div>
  );
};

export default UpcomingAnimes;
