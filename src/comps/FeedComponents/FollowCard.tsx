// This file contains the code for the Follow Cards shown in feed to let user follow/ unfollow other users.

import React, { useEffect, useState } from "react";
import { FullUser } from "../../types/types";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import { useAuth } from "../../hooks/useAuth";

import { useNavigate } from "react-router-dom";
import { useFollow } from "@/hooks/useFollow";
import useUnfollow from "@/hooks/useUnfollow";

interface FollowCardProps {
  person: FullUser;
  isFollowingIds: string[];
  onFollowStatusChange: (uid: string, isFollowing: boolean) => void;
}

const FollowCard: React.FC<FollowCardProps> = ({
  person,
  isFollowingIds,
  onFollowStatusChange,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    if (isFollowingIds?.includes(person?.uid)) {
      setIsFollowing(true);
    }
  }, [isFollowingIds, person?.uid]);

  const { handleFollow } = useFollow(user?.id, person.uid);
  const { handleUnfollow } = useUnfollow(user?.id, person.uid);

  const onFollowClick = async () => {
    await handleFollow();
    setIsFollowing(true);
    onFollowStatusChange(person.uid, true);
  };

  const onUnfollowClick = async () => {
    await handleUnfollow();
    setIsFollowing(false);
    onFollowStatusChange(person.uid, false);
  };

  return (
    <>
      {" "}
      <div
        className="flex cursor-pointer"
        onClick={() => navigate(`/profile/${person.uid}`)}
      >
        <img
          src={person.dp_url ? person.dp_url : "/defaultDp.jpg"}
          alt="Profile"
          className="w-16 h-16 rounded-full"
        />
        <div className="ml-2">
          <p className="text-sky-200 text-lg">{person.name}</p>
          <p className="text-gray-400 text-sm">@{person.username}</p>
        </div>
      </div>
      <div>
        {person.uid !== user?.id &&
          (!isFollowing ? (
            <button
              className="flex items-center bg-purple-900 hover:bg-purple-950 px-4 py-2 rounded text-sm transition-all duration-300"
              onClick={onFollowClick}
            >
              <SlUserFollow /> &nbsp; Follow
            </button>
          ) : (
            <button
              className="flex items-center bg-gray-900 hover:bg-gray-950 px-4 py-2 rounded-lg text-sm transition-all duration-300"
              onClick={onUnfollowClick}
            >
              <SlUserUnfollow /> &nbsp; Unfollow
            </button>
          ))}
      </div>
    </>
  );
};

export default FollowCard;
