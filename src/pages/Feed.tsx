// This file contains the code for the Feed or the Home page of the application.

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useAuth } from "../hooks/useAuth";
import { FetchPostsData, Post } from "../types/types";
import {
  FETCH_FOLLOWING_USERS_POSTS_QUERY,
  FETCH_FOLLOWING_USERS,
} from "../graphql/queries/queries";
import PostCard from "../comps/PostCard";
import NavBar from "../comps/NavBar";
import Sidebar from "../comps/FeedComponents/Sidebar";
import { LuLoader } from "react-icons/lu";
import MobileMenuBar from "@/comps/FeedComponents/MobileMenuBar";

const Feed = () => {
  const { user } = useAuth(); // Fetching logged in user using custom hook.

  const { data: followingData } = useQuery(FETCH_FOLLOWING_USERS, {
    variables: { follower_id: user?.id },
    skip: !user,
  }); // Fetching the user ids of users being followed by logged in user to show their posts on the feed.

  const followingIds = followingData?.follow_infoCollection.edges.map(
    (edge: any) => edge.node.following_id || []
  );

  const { data, loading, error } = useQuery<FetchPostsData>(
    FETCH_FOLLOWING_USERS_POSTS_QUERY,
    {
      variables: { user_ids: followingIds },
      skip: followingIds?.length === 0,
    }
  ); // Fetching the posts created by the users being followed by logged in user.

  useEffect(() => {}, [user]);

  const postData: Post[] =
    data?.postsCollection?.edges
      .map((edge) => ({
        id: edge.node.id,
        post_text: edge.node.post_text,
        post_img_url: edge.node.post_img_url || null,
        user_id: edge.node.user_id,
        username: edge.node.username,
        tags: edge.node.tags ? JSON.parse(edge.node.tags) : [],
        created_at: new Date(edge.node.created_at),
        users: {
          name: edge.node.users?.name,
          dp_url: edge.node.users?.dp_url || null,
        },
      }))
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime()) || []; // Destructuring the posts data fetched by query with the help of custom type.

  if (error) return <p>Error fetching posts: {error.message}</p>;

  return (
    <div className="py-5 px-5 bg-[#120f21]">
      {loading ? (
        <div className="h-[100vh] flex items-center w-full">
          <LuLoader className="text-6xl text-gray-700 animate-spin m-auto" />
        </div>
      ) : (
        <div>
          <NavBar /> {/* Navigation Bar Component. */}
          {/* PostCard component to show post. */}
          <div className="flex flex-col md:flex-row">
            <div className="md:px-6 py-2 md:w-[65%]">
              {postData.length > 0 ? (
                postData.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <div className=" h-[77vh] flex justify-center items-center flex-col gap-5">
                  <h2 className="text-3xl text-gray-700 font-bold">
                    No posts to show :(
                  </h2>
                  <p className="text-gray-700 font-semibold">
                    Don't Worry. Follow some users to view their posts.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar component to show the details on the side bar of feed. */}
            <Sidebar followingIds={followingIds} />

            <MobileMenuBar followingIds={followingIds} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
