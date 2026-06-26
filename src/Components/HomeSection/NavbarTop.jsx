import { useState, useEffect, useRef } from "react";
import Logo from "../../assets/Logo.png";
import { BsFillPersonFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdMenu, MdClose } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Genres from "../GenreSection/Genres";
import SearchBar from "../SearchSection/SearchBar";

const GENRE_LIST = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Anime", to: "/animes" },
  { label: "Movies", to: "/movies" },
  { label: "Series", to: "/series" },
];

const COMING_SOON_ITEMS = ["Profile", "Favorites", "Watchlist", "Settings"];

const ComingSoonToast = () => (
  <div
    className="fixed bottom-6 left-1/2 z-[999] px-6 py-3 rounded-xl text-sm font-semibold text-white"
    style={{
      transform: "translateX(-50%)",
      background: "rgba(20,20,20,0.95)",
      border: "1px solid rgba(229,22,58,0.4)",
      backdropFilter: "blur(12px)",
      animation: "fadeSlideUp 0.3s ease",
    }}
  >
    🚧 Coming Soon! Available after Firebase Authentication is added.
    <style>{`
      @keyframes fadeSlideUp {
        from { opacity:0; transform:translateX(-50%) translateY(12px); }
        to   { opacity:1; transform:translateX(-50%) translateY(0); }
      }
    `}</style>
  </div>
);

const NavbarTop = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileGenresOpen, setMobileGenresOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  /* ── Active detection ── */
  const isActive = (to) => {
    if (to === "/") return pathname === "/";
    return pathname === to;
  };
  const isGenresActive = pathname.startsWith("/genres");

  /* Active link classes — appended on top of the existing hover classes */
  const linkClass = (to) =>
    `relative group font-semibold transition-all active:scale-95 duration-300 cursor-pointer
     hover:text-red-500 hover:[text-shadow:0_0_5px_#df0f0f,0_0_30px_#df0f0f]
     ${
       isActive(to)
         ? "text-red-500 [text-shadow:0_0_5px_#df0f0f,0_0_30px_#df0f0f]"
         : ""
     }`;

  const genreLinkClass = `relative group font-semibold transition-all active:scale-95 duration-300 cursor-pointer
     hover:text-red-500 hover:[text-shadow:0_0_5px_#df0f0f,0_0_30px_#df0f0f]
     ${
       isGenresActive
         ? "text-red-500 [text-shadow:0_0_5px_#df0f0f,0_0_30px_#df0f0f]"
         : ""
     }`;

  const closeMenu = () => {
    setMenuOpen(false);
    setMobileGenresOpen(false);
  };

  const showComingSoon = () => {
    setDropdownOpen(false);
    setComingSoon(true);
    setTimeout(() => setComingSoon(false), 3000);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    onLogout();
    navigate("/");
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-20 bg-[#181818]/50 backdrop-blur-md flex items-center justify-between z-50">
        {/* ── Left ── */}
        <div className="flex items-center gap-6 xl:gap-10 2xl:gap-15">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center justify-around font-serif cursor-pointer hover:[text-shadow:0_0_5px_#df0f0f,0_0_30px_#df0f0f]
              pl-4 lg:pl-6 2xl:pl-10 text-xl 2xl:text-2xl"
          >
            <img src={Logo} alt="Logo" className="h-11 2xl:h-13 object-cover" />
            <h3>ANIME</h3>
            <h3 className="text-red-600">VERSE</h3>
          </Link>

          <div className="hidden lg:flex items-center gap-6 xl:gap-10 2xl:gap-15">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={linkClass(link.to)}>
                {link.label}
                {/* underline — always visible when active, animates on hover */}
                <span
                  className={`absolute left-0 -bottom-3 h-1 rounded-full bg-red-600
                    transition-all duration-300
                    ${isActive(link.to) ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            ))}

            <Link to="/genres/:genre" className={genreLinkClass}>
              Genres
              <span
                className={`absolute left-0 -bottom-3 h-1 rounded-full bg-red-600
                  transition-all duration-300
                  ${isGenresActive ? "w-full" : "w-0 group-hover:w-full"}`}
              />
              <Genres />
            </Link>
          </div>
        </div>

        {/* ── Right ── */}
        <div className="flex items-center pr-4 lg:pr-6 2xl:pr-10 gap-3 lg:gap-4 2xl:gap-5">
          <div className="hidden sm:block">
            <SearchBar />
          </div>

          <div className="hidden xl:block">
            <IoMdNotificationsOutline className="text-2xl hover:scale-130 active:scale-95 hover:text-red-600 transition-all duration-300 cursor-pointer" />
          </div>

          {user ? (
            <div className="hidden lg:block relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 py-2 px-4 border border-[#292828] rounded-2xl font-medium hover:text-red-600 hover:border-red-600 hover:shadow hover:shadow-red-800 cursor-pointer active:scale-95 transition-all duration-300 hover:[text-shadow:0_0_5px_#df0f0f,0_0_15px_#df0f0f]"
              >
                <BsFillPersonFill />
                <span className="max-w-[100px] truncate">👋 {user}</span>
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 top-14 w-52 rounded-xl overflow-hidden z-50"
                  style={{
                    background: "rgba(14,14,14,0.97)",
                    border: "1px solid #2a2a2a",
                    backdropFilter: "blur(16px)",
                    animation: "dropIn 0.2s ease",
                  }}
                >
                  <style>{`@keyframes dropIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
                  {COMING_SOON_ITEMS.map((item) => (
                    <button
                      key={item}
                      onClick={showComingSoon}
                      className="w-full text-left px-5 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                  <div style={{ borderTop: "1px solid #2a2a2a" }} />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-all duration-200 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/signin"
              className="hidden lg:flex py-2 w-25 border border-[#292828] rounded-2xl items-center justify-center gap-1 font-medium hover:text-red-600 hover:border hover:border-red-600 hover:shadow hover:shadow-red-800 cursor-pointer active:scale-95 transition-all duration-300 hover:[text-shadow:0_0_5px_#df0f0f,0_0_15px_#df0f0f]"
            >
              <BsFillPersonFill />
              Sign In
            </Link>
          )}

          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 hover:bg-white/10 active:scale-95 cursor-pointer"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <MdClose size={26} /> : <MdMenu size={26} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer — unchanged ── */}
      <div
        className="fixed top-0 right-0 h-full w-72 z-40 flex flex-col lg:hidden"
        style={{
          background: "rgba(15,15,15,0.97)",
          backdropFilter: "blur(16px)",
          borderLeft: "1px solid #2a2a2a",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid #2a2a2a" }}
        >
          <span className="font-serif text-lg font-bold">
            ANIME<span className="text-red-600">VERSE</span>
          </span>
          <button
            onClick={closeMenu}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <MdClose size={20} />
          </button>
        </div>

        <div
          className="px-4 py-4 sm:hidden"
          style={{ borderBottom: "1px solid #2a2a2a" }}
        >
          <SearchBar />
        </div>

        <nav className="flex flex-col px-4 py-4 gap-1 overflow-y-auto flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={`flex items-center px-4 py-3 rounded-lg font-semibold hover:bg-white/5 transition-all duration-200 active:scale-95
                ${isActive(link.to) ? "text-red-500" : "text-white hover:text-red-500"}`}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={() => setMobileGenresOpen((v) => !v)}
            className={`flex items-center justify-between px-4 py-3 rounded-lg font-semibold hover:bg-white/5 transition-all duration-200 active:scale-95 cursor-pointer w-full text-left
              ${isGenresActive ? "text-red-500" : "text-white hover:text-red-500"}`}
          >
            <span>Genres</span>
            <span
              style={{
                display: "inline-block",
                transition: "transform 0.3s",
                transform: mobileGenresOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▾
            </span>
          </button>

          <div
            style={{
              maxHeight: mobileGenresOpen ? "400px" : "0px",
              overflow: "hidden",
              transition: "max-height 0.35s ease",
            }}
          >
            <div className="flex flex-col pl-4 gap-1 pb-2">
              {GENRE_LIST.map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    closeMenu();
                    navigate(`/genres/${genre.toLowerCase()}`);
                  }}
                  className="text-left px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-red-400 hover:bg-white/5 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="my-2" style={{ borderTop: "1px solid #2a2a2a" }} />

          <button className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-white hover:text-red-500 hover:bg-white/5 transition-all duration-200 active:scale-95 cursor-pointer">
            <IoMdNotificationsOutline size={20} />
            Notifications
          </button>

          {user ? (
            <>
              {COMING_SOON_ITEMS.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    closeMenu();
                    showComingSoon();
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-red-400 hover:text-red-300 hover:bg-white/5 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/signin"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-white hover:text-red-500 hover:bg-white/5 transition-all duration-200 active:scale-95"
            >
              <BsFillPersonFill size={18} />
              Sign In
            </Link>
          )}
        </nav>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
          onClick={closeMenu}
        />
      )}

      {comingSoon && <ComingSoonToast />}
    </>
  );
};

export default NavbarTop;
