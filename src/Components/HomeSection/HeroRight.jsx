import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const TRENDING_QUERY = `
  query {
    Page(page: 1, perPage: 5) {
      media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
        id
        title { english romaji }
        coverImage { large }
        episodes
        averageScore
      }
    }
  }
`;

const SidebarSkeleton = () => (
  <div className="flex flex-col gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
        <div className="w-8 h-8 rounded bg-[#2a2a2a] animate-pulse shrink-0" />
        <div
          className="w-14 h-18 rounded-md bg-[#2a2a2a] animate-pulse shrink-0"
          style={{ minHeight: "72px" }}
        />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-3 w-full rounded bg-[#2a2a2a] animate-pulse" />
          <div className="h-2.5 w-3/4 rounded bg-[#2a2a2a] animate-pulse" />
          <div className="h-2.5 w-1/2 rounded bg-[#2a2a2a] animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

const HeroRight = () => {
  const navigate = useNavigate();
  const [trendingData, setTrendingData] = useState([]);
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

        if (!response.ok) throw new Error("Network error");

        const result = await response.json();

        const formatted = result.data.Page.media.map((anime, index) => ({
          id: anime.id,
          rank: String(index + 1).padStart(2, "0"),
          title: anime.title.english || anime.title.romaji,
          ep: anime.episodes ? `${anime.episodes} Episodes` : "Ongoing",
          rating: anime.averageScore
            ? `⭐ ${(anime.averageScore / 10).toFixed(1)}`
            : "⭐ N/A",
          img: anime.coverImage.large,
        }));

        setTrendingData(formatted);
      } catch (err) {
        setError("Failed to load trending anime.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="hidden min-[1280px]:block w-72 bg-[#141414] px-4 py-4 shrink-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Trending Now</h3>

        <Link
          to="/trending"
          className="text-sm text-gray-400 hover:text-red-500 active:scale-95 cursor-pointer transition"
        >
          View All →
        </Link>
      </div>

      {loading && <SidebarSkeleton />}

      {error && <p className="text-red-400 text-xs px-2 py-4">{error}</p>}

      {!loading &&
        !error &&
        trendingData.map((item) => (
          <div
            key={item.rank}
            onClick={() => navigate(`/anime/${item.id}`)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1b1b1b] transition cursor-pointer"
          >
            <span
              className={`text-2xl font-black w-8 text-center ${
                Number(item.rank) <= 3 ? "text-red-500" : "text-gray-700"
              }`}
            >
              {item.rank}
            </span>

            <img
              src={item.img}
              alt={item.title}
              className="w-14 h-18 rounded-md object-cover shrink-0"
            />

            <div className="flex-1">
              <h4 className="text-sm font-semibold line-clamp-1">
                {item.title}
              </h4>
              <p className="text-xs text-gray-400">{item.ep}</p>
              <p className="text-xs text-red-500 mt-1">{item.rating}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default HeroRight;
