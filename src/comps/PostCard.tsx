// This file contains the code for the Post Card component to display contents of a post.

import React from "react";
import { Post } from "../types/types";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supaBaseClient";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();

  const handleTagClick = async (tag: string) => {
    const { data: taggedUserId } = await supabase
      .from("users")
      .select("uid")
      .eq("username", tag);

    console.log();

    navigate(`/profile/${taggedUserId && taggedUserId[0].uid}`);
  };
  return (
    <div className=" py-3 px-4 mb-10 rounded-xl shadow-[1px_1px_10px_1px_rgba(255,255,255,0.1)]  bg-[#100d1c] md:w-[95%]">
      <div
        className="flex items-center gap-3 mb-4 cursor-pointer"
        onClick={() => navigate(`/profile/${post?.user_id}`)}
      >
        <img
          src={post.users?.dp_url ? post.users?.dp_url : "/defaultDp.jpg"}
          alt="dp"
          className="h-10 w-10 md:w-12 md:h-12 rounded-full"
        />
        <div>
          <p className="font-semibold md:text-xl text-blue-200">
            {post.users?.name}
          </p>
          <p className=" text-xs md:text-sm text-gray-400">@{post.username}</p>
        </div>
      </div>
      <div className="flex justify-between">
        <p className="px-1 md:text-lg">{post.post_text}</p>
      </div>

      {post.post_img_url && (
        <img
          src={post.post_img_url}
          alt="Post image"
          className="mt-2 w-full max-h-48 md:max-h-80 rounded-xl"
        />
      )}
      <div className="flex items-end justify-end  flex-wrap gap-2 mt-2">
        {post.tags.length > 0 &&
          post.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-800 text-xs text-blue-400 rounded-full px-2 py-1 cursor-pointer hover:bg-blue-500 h-fit hover:text-white transition-all duration-200"
              onClick={() => handleTagClick(tag)}
            >
              @{tag}
            </span>
          ))}
      </div>
    </div>
  );
};

export default PostCard;
