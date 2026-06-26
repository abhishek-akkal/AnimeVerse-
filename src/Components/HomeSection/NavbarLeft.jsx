import { IoHomeOutline } from "react-icons/io5";
import { BsFire } from "react-icons/bs";
import { FaRegStar } from "react-icons/fa";
import { FaRegListAlt } from "react-icons/fa";
import { BiMoviePlay } from "react-icons/bi";
import { BiCategoryAlt } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { LuHistory } from "react-icons/lu";

const iconSytles =
  "text-2xl hover:text-red-700 transition-all hover:scale-125 active:scale-95 duration-300 cursor-pointer hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]";

const NavbarLeft = () => {
  return (
    <div className="h-635 w-20 bg-[#141414] flex flex-col items-center justify-start gap-10 py-5 z-10">
      {/* Home */}
      <div className={iconSytles}>
        <IoHomeOutline />
      </div>

      {/* Trending  */}
      <div className={iconSytles}>
        <BsFire />
      </div>

      {/* Top rated  */}
      <div className={iconSytles}>
        <FaRegStar />
      </div>

      {/* List */}
      <div className={iconSytles}>
        <FaRegListAlt />
      </div>

      {/* Movies */}
      <div className={iconSytles}>
        <BiMoviePlay />
      </div>

      {/* Geners */}
      <div className={iconSytles}>
        <BiCategoryAlt />
      </div>

      {/* Watchlist */}
      <div className={iconSytles}>
        <FaRegHeart />
      </div>

      {/* History  */}
      <div className={iconSytles}>
        <LuHistory />
      </div>
    </div>
  );
};

export default NavbarLeft;
