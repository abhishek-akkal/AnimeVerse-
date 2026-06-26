import FooterImg from "../assets/HeroSection/FooterImg.png";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden rounded-t-2xl min-h-75">
      {/* Background Image */}
      <img
        src={FooterImg}
        alt="Footer Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65"></div>

      {/* Content */}
      <div className="relative z-10 h-full px-6 md:px-10 xl:px-16 py-12 flex flex-col md:flex-row md:flex-wrap xl:flex-nowrap gap-10 xl:justify-between">
        {/* Left — Brand */}
        <div className="max-w-sm md:w-full xl:w-auto text-center md:text-left">
          <h1 className="text-4xl xl:text-5xl font-black">
            Anime<span className="text-red-600">Verse</span>
          </h1>
          <p className="mt-5 text-zinc-300 leading-7">
            Dive into thousands of anime series, movies and discover your next
            favorite adventure.
          </p>
        </div>

        {/* Middle — Nav Links */}
        <div className="flex gap-10 md:gap-14 xl:gap-20 justify-center md:justify-start flex-wrap md:flex-nowrap">
          <div>
            <h3 className="text-red-500 font-bold mb-4">Explore</h3>
            <ul className="space-y-3 text-zinc-300">
              <li>Home</li>
              <li>Anime</li>
              <li>Movies</li>
              <li>Series</li>
              <li>Genres</li>
            </ul>
          </div>

          <div>
            <h3 className="text-red-500 font-bold mb-4">Community</h3>
            <ul className="space-y-3 text-zinc-300">
              <li>Discord</li>
              <li>Reddit</li>
              <li>Instagram</li>
              <li>Twitter</li>
            </ul>
          </div>

          <div>
            <h3 className="text-red-500 font-bold mb-4">Support</h3>
            <ul className="space-y-3 text-zinc-300">
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>

        {/* Right — Newsletter */}
        <div className="w-full md:w-auto xl:max-w-xs text-center md:text-left">
          <h3 className="text-red-500 font-bold mb-4">Stay Updated</h3>
          <p className="text-zinc-300 mb-5">
            Subscribe to receive new anime updates.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Email Address"
              className="flex-1 min-w-0 bg-black/50 border border-zinc-700 px-4 py-3 outline-none"
            />
            <button className="bg-red-600 px-5 hover:bg-red-700 transition active:scale-95 cursor-pointer shrink-0">
              →
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
