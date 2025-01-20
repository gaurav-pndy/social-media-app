// This file contains code for the Profile Card component for displaying the information of logged in user in the Profile page.

import React, { useEffect, useState } from "react";
import { TiHomeOutline } from "react-icons/ti";
import CreatePost from "../PostCreationComps/CreatePost";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useAuth } from "@/hooks/useAuth";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import { useFollow } from "@/hooks/useFollow";
import useUnfollow from "@/hooks/useUnfollow";
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";

interface ProfileCardProps {
  noOfPosts: number | undefined;
  isLoggedInUser: boolean;
  followingIds: string[];
  isFollowingIds: string[];
  followersIds: string[];
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  noOfPosts,
  isLoggedInUser,
  followingIds,
  isFollowingIds,
  followersIds,
}) => {
  const { user } = useAuth(); // Fetching the logged in user using custom hook.

  const { id: currentUserId } = useParams();

  const { userData } = useFetchUser(isLoggedInUser ? user?.id : currentUserId); // Fetching the details of logged in user from 'users' table using custom hook.

  const [noOfFollowers, setNoOfFollowers] = useState<number>(
    followersIds?.length
  );
  const [noOfFollowing, setNoOfFollowing] = useState<number>(
    followingIds?.length
  );

  if (!currentUserId) {
    console.error("User ID is undefined.");
    return null;
  }

  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

  useEffect(() => {
    if (isFollowingIds?.includes(currentUserId)) {
      setIsFollowing(true);
    }
  }, [currentUserId, isFollowingIds, isFollowing]);

  useEffect(() => {
    if (followersIds?.length && followingIds?.length) {
      setNoOfFollowers(followersIds?.length);
      setNoOfFollowing(followingIds?.length);
    }
  }, [followersIds, followingIds]);

  const onFollowersChange = (change: number) => {
    setNoOfFollowers((prev: number) => prev + change);
  };

  const { handleFollow } = useFollow(user?.id, currentUserId);
  const { handleUnfollow } = useUnfollow(user?.id, currentUserId);

  const onFollowClick = () => {
    handleFollow();
    setIsFollowing(true);
    onFollowersChange(1);
  };

  const onUnfollowClick = () => {
    handleUnfollow();
    setIsFollowing(false);
    onFollowersChange(-1);
  };

  const navigate = useNavigate();
  return (
    <div className=" flex flex-col items-center ">
      <div className=" flex flex-col items-center p-5">
        <div>
          <img
            src={userData?.dp_url ? userData.dp_url : "/defaultDp.jpg"}
            alt="dp"
            className="w-56 h-56 rounded-full"
          />
        </div>
        <h3 className="text-3xl mt-2 text-cyan-300">{userData?.name}</h3>
        <div className="flex text-gray-400 gap-3">
          <span>@{userData?.username}</span>•<span>{userData?.email}</span>
        </div>
        <div className="flex gap-3 mt-3">
          <FollowersList
            noOfFollowers={noOfFollowers}
            followersIds={followersIds}
            isFollowingIds={isFollowingIds}
          />
          •
          <span>
            {" "}
            <strong className="text-lg">{noOfPosts}</strong> posts
          </span>
          •
          <FollowingList
            noOfFollowing={noOfFollowing}
            followingIds={followingIds}
            isFollowingIds={isFollowingIds}
          />
        </div>
      </div>

      <div className="flex  gap-5">
        {isLoggedInUser ? (
          <CreatePost />
        ) : isFollowing ? (
          <button
            className="flex items-center  bg-gray-800 hover:bg-gray-900 py-2 px-4 rounded-2xl text-sm transition-all duration-300"
            onClick={onUnfollowClick}
          >
            <SlUserUnfollow /> &nbsp; Unfollow
          </button>
        ) : (
          <button
            className="flex items-center  bg-purple-900 hover:bg-purple-950 py-2 px-4 rounded-2xl  transition-all duration-300"
            onClick={onFollowClick}
          >
            <SlUserFollow /> &nbsp; Follow
          </button>
        )}

        <button
          onClick={() => navigate("/feed")}
          className="bg-yellow-700 hover:bg-yellow-900 py-2 px-4 rounded-2xl flex items-center justify-center gap-1 transition-all duration-300"
        >
          <TiHomeOutline className="text-lg" /> Go to Feed
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
