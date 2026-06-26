import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex items-center rounded-2xl hover:border hover:border-red-500 transition-all duration-300">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search anime..."
        className="py-2 rounded-l-2xl font-semibold border border-[#292828] bg-[#242323] px-5 hover:border focus:outline-none hover:shadow hover:shadow-red-800 transition-all duration-300
          w-44
          xl:w-64
          2xl:w-90"
      />
      <div
        onClick={handleSearch}
        className="py-2 px-3 border border-[#292828] bg-[#242323] rounded-r-2xl hover:border hover:shadow hover:shadow-red-700 transition-all duration-300 cursor-pointer"
      >
        <IoSearch className="text-2xl" />
      </div>
    </div>
  );
};

export default SearchBar;
