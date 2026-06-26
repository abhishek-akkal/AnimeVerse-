import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import NavbarTop from "./Components/HomeSection/NavbarTop";
import NavbarLeft from "./Components/HomeSection/NavbarLeft";
import HeroSection from "./Components/HomeSection/HeroSection";
import PopularAnimes from "./Components/Content/PopularAnimes";
import UpcomingAnimes from "./Components/Content/UpcomingAnimes";
import Footer from "./Components/Footer";
import Animes from "./Components/AnimeSection/Animes";
import Movies from "./Components/MovieSection/Movies";
import Series from "./Components/SeriesSection/Series";
import GenrePage from "./Components/GenreSection/GenrePage";
import ScrollToTop from "./Components/ScrollToTop";
import Pages from "./Components/PagesSection/Pages";
import AnimeDetails from "./Components/AnimeDetailsSection/AnimeDetails";
import SignIn from "./Components/SignInSection/SignIn";
import HeroTrendingAni from "./Components/HomeSection/HeroTrendingAni";
import UpcomingMultiAni from "./Components/Content/UpcomingMultiAni";
import IntroScreen from "./Components/Intro/IntroScreen";

const HomePage = () => (
  <div className="flex min-w-0 w-full">
    <div className="flex-1 min-w-0 w-full overflow-x-hidden">
      <HeroSection />

      <div className="flex min-w-0">
        <div className="flex-1 min-w-0 overflow-x-hidden">
          <PopularAnimes />
        </div>

        <div className="hidden xl:block shrink-0">
          <UpcomingAnimes />
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  const [user, setUser] = useState(
    () => localStorage.getItem("animeverseUser") || null,
  );
  const [introComplete, setIntroComplete] = useState(false);

  const handleLogin = (name) => setUser(name);
  const handleLogout = () => {
    localStorage.removeItem("animeverseUser");
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden w-full">
      {/* Intro plays once — sits above everything via z-[9999] */}
      {!introComplete && (
        <IntroScreen onComplete={() => setIntroComplete(true)} />
      )}

      <ScrollToTop />
      <NavbarTop user={user} onLogout={handleLogout} />

      <main className="pt-20 w-full overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/animes" element={<Animes />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<Series />} />
          <Route path="/genres/:genre" element={<GenrePage />} />
          <Route path="/search" element={<Pages />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
          <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
          <Route path="/trending" element={<HeroTrendingAni />} />
          <Route path="/upcoming" element={<UpcomingMultiAni />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
