import { signOut, useSession } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import millify from "millify";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Center() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => {
          setPlaylist(data.body);
        })
        .catch((err) => console.log("Something went Wrong", err));
    }
  }, [spotifyApi, playlistId, session]);
  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide ">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center text-white border-gray-500 border-[1px] bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
          onClick={() => signOut()}
        >
          <img
            src={session?.user?.image}
            className="rounded-full w-10 h-10"
            alt="profile_avatar "
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="w-5 h-5" />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7  bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      >
        <img
          src={playlist?.images?.[0]?.url}
          alt=""
          className="w-32 h-32 md:h-56 md:w-56 shadow-2xl "
        />
        <div>
          <p className="text-xs">PLAYLIST</p>
          <h1 className="text-3xl md:text-5xl xl:text-7xl font-bold ">
            {playlist?.name}
          </h1>
          <p className="text-sm pt-2 mb-2 w-72 truncate ...">
            {playlist?.description}
          </p>
          <p className="text-sm text-">
            {millify(playlist?.followers?.total || 0)} followers
          </p>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Center;
