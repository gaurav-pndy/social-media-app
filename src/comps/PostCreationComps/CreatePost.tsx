// This file contains the code that defines the logic for creating a new post.

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { CREATE_POST_MUTATION } from "../../graphql/mutations/mutations";
import { GET_USERS_QUERY } from "../../graphql/queries/queries";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../services/supaBaseClient";
import CreatePostCard from "./CreatePostCard";

const CreatePost = () => {
  const [postText, setPostText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userSuggestions, setUserSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuth(); // Fetch the current logged in user.

  const [createPost] = useMutation(CREATE_POST_MUTATION); // The mutation to create a new post.
  const { data: usersData } = useQuery(GET_USERS_QUERY); // Fetching the usernames of other users to show in tag suggestions.

  useEffect(() => {
    // Show suggestions to users while entering usernames to tag on their post.

    if (searchTerm) {
      const suggestions = usersData?.usersCollection?.edges
        ?.filter((u: { node: { username: string } }) =>
          u.node.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((u: { node: { username: string } }) => u.node.username);

      setUserSuggestions(suggestions || []);
    } else {
      setUserSuggestions([]);
    }
  }, [searchTerm, usersData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImageFile(file);
  }; // Saving the image attached to post in a state

  // The next two functions handle adding and removing tagged usernames from the post.

  const handleAddTag = (username: string) => {
    if (!taggedUsers.includes(username)) {
      setTaggedUsers((prev) => [...prev, username]);
    }

    setSearchTerm("");
    setUserSuggestions([]);
  };

  const handleRemoveTag = (username: string) => {
    setTaggedUsers((prev) => prev.filter((user) => user !== username));
  };

  // This function handles the logic of creating a new post with all the received info after "Post" button is clicked.

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    let postImgUrl: string | null = null;

    try {
      const userId = user?.id;
      const username = user?.user_metadata.username;

      // Uploading the image added in post (if any), to Supabase storage bucket named 'posts-images'.

      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const filePath = `posts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("posts-images")
          .upload(filePath, imageFile);

        if (uploadError) {
          console.error("Error uploading image:", uploadError.message);
          return;
        }

        const { data: publicData } = supabase.storage // After uploading the image, getting the image URL from the Supabase storage bucket.
          .from("posts-images")
          .getPublicUrl(filePath);

        postImgUrl = publicData.publicUrl;
      }

      console.log(taggedUsers);

      await createPost({
        variables: {
          postText,
          postImgUrl,
          userId,
          username,
          tags: JSON.stringify(taggedUsers),
        },
      }); // Finally running the mutation to create new post and passing all the information in variables.

      setLoading(false);
      window.location.reload();
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <div>
      {/* The CreatePostCard component */}
      <CreatePostCard
        postText={postText}
        setPostText={setPostText}
        handleFileChange={handleFileChange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        userSuggestions={userSuggestions}
        handleAddTag={handleAddTag}
        handleRemoveTag={handleRemoveTag}
        taggedUsers={taggedUsers}
        loading={loading}
        handleCreatePost={handleCreatePost}
      />
    </div>
  );
};

export default CreatePost;
