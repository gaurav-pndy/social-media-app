// This file contains the code for Curent User card which shows the info of logged in user in feed.

import { User } from "@/types/types";
import { CgProfile } from "react-icons/cg";

import { useNavigate } from "react-router-dom";

interface CurrentUserCardProps {
  userDp: string | null | undefined;
  user: User | null;
}

const CurrentUserCard: React.FC<CurrentUserCardProps> = ({ userDp, user }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-around ">
      <img
        src={userDp ? userDp : "./defaultDp.jpg"}
        alt=""
        className="rounded-full w-36 h-36 "
      />

      <div className=" h-28 justify-between flex flex-col ">
        <div>
          <p className="text-2xl text-emerald-200">
            {user?.user_metadata.name}
          </p>
          <p className="text-gray-400  text-sm">
            @{user?.user_metadata.username}
          </p>
        </div>

        <button
          onClick={() => navigate(`/profile/${user?.id}`)}
          className="bg-pink-900 hover:bg-pink-950 py-2 px-3 rounded-2xl flex items-center justify-center gap-1 transition-all duration-300"
        >
          <CgProfile className="text-lg" /> Go to Profile
        </button>
      </div>
    </div>
  );
};

export default CurrentUserCard;
