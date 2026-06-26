import {
  GiCrossedSwords,
  GiBroadsword,
  GiDramaMasks,
  GiFairyWand,
  GiGhost,
  GiHeartBottle,
  GiLaserBlast,
  GiFlowerPot,
  GiSpellBook,
  GiRunningShoe,
  GiMagnifyingGlass,
} from "react-icons/gi";
import { BsFillEmojiWinkFill } from "react-icons/bs";

import { FaLaughBeam } from "react-icons/fa";

const genreData = [
  {
    id: 1,
    name: "Action",
    icon: <GiCrossedSwords />,
  },
  {
    id: 2,
    name: "Adventure",
    icon: <GiBroadsword />,
  },
  {
    id: 3,
    name: "Comedy",
    icon: <FaLaughBeam />,
  },
  {
    id: 4,
    name: "Drama",
    icon: <GiDramaMasks />,
  },
  {
    id: 5,
    name: "Hentai",
    icon: <BsFillEmojiWinkFill />,
  },
  {
    id: 6,
    name: "Fantasy",
    icon: <GiFairyWand />,
  },
  {
    id: 7,
    name: "Horror",
    icon: <GiGhost />,
  },
  {
    id: 8,
    name: "Romance",
    icon: <GiHeartBottle />,
  },
  {
    id: 9,
    name: "Sci-Fi",
    icon: <GiLaserBlast />,
  },
  {
    id: 10,
    name: "Slice of Life",
    icon: <GiFlowerPot />,
  },
  {
    id: 11,
    name: "Supernatural",
    icon: <GiSpellBook />,
  },
  {
    id: 12,
    name: "Sports",
    icon: <GiRunningShoe />,
  },
  {
    id: 13,
    name: "Mystery",
    icon: <GiMagnifyingGlass />,
  },
];

export default genreData;
