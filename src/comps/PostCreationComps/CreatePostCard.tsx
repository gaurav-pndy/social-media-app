// This file contains the code for the CreatePost Card component where users can enter the information for creating new post.

import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { FaUserTag } from "react-icons/fa";
import { FiImage } from "react-icons/fi";
import { Textarea } from "../../components/ui/textarea";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer"; // Importing the required components for the Drawer component of shadcn.
import CreatePostBtn from "./CreatePostBtn";
import { useAuth } from "../../hooks/useAuth";
import { useFetchUser } from "../../hooks/useFetchUser";
import { TbLoaderQuarter } from "react-icons/tb";

interface CreatePostCardProps {
  postText: string;
  setPostText: React.Dispatch<React.SetStateAction<string>>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  userSuggestions: string[];
  handleAddTag: (username: string) => void;
  handleRemoveTag: (username: string) => void;
  taggedUsers: string[];
  loading: boolean;
  handleCreatePost: (e: React.FormEvent) => Promise<void>;
}

const CreatePostCard: React.FC<CreatePostCardProps> = ({
  postText,
  setPostText,
  handleFileChange,
  searchTerm,
  setSearchTerm,
  userSuggestions,
  handleAddTag,
  handleRemoveTag,
  taggedUsers,
  loading,

  handleCreatePost,
}) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(0);

  const { user } = useAuth();
  const { userData } = useFetchUser(user?.id);

  // Function to display a preview of the selected image.

  const handleFileChangeWithPreview = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      handleFileChange(e); // Function in parent component (CreatePost) for uplading the image to Supabase storage bucket.
    }
  };

  // Function to remove the image preview if image is removed.
  const handleRemoveImagePreview = () => {
    setImagePreview(null);
    setFileInputKey((prevKey) => prevKey + 1);
  };

  return (
    <div className=" w-fit ">
      <Drawer>
        <DrawerTrigger asChild>
          <CreatePostBtn />
        </DrawerTrigger>
        <DrawerContent className="md:w-[50%] mx-auto md:px-5 bg-black">
          <DrawerHeader>
            <DrawerTitle className="text-2xl">Create Post</DrawerTitle>
          </DrawerHeader>
          <div className="px-5">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={userData?.dp_url ? userData?.dp_url : "./defaultDp.jpg"}
                alt="dp"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm">{user?.user_metadata.name}</p>
                <p className="text-xs text-gray-400">
                  @{user?.user_metadata.username}
                </p>
              </div>
            </div>
            <form onSubmit={handleCreatePost}>
              <div className="flex flex-col">
                <Textarea
                  className="my-2 rounded-xl text-xl placeholder:text-gray-500 placeholder:text-xl border-none bg-[#020218] h-40"
                  id="postText"
                  value={postText}
                  placeholder="What's happening ?"
                  onChange={(e) => setPostText(e.target.value)}
                  required
                />
              </div>

              {/* Showing the preview of selected image. */}

              {imagePreview && (
                <div className="mb-2 relative w-[50%]">
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="w-full rounded max-h-48"
                  />

                  <button
                    type="button"
                    onClick={handleRemoveImagePreview}
                    className="absolute bg-gray-800 top-0 right-0 p-2 text-red-500 text-lg"
                  >
                    <RxCross1 className="font-bold" />
                  </button>
                </div>
              )}
              <div className="flex justify-between">
                <div className="flex flex-wrap items-center overflow-auto custom-scrollbar gap-2 h-6 w-[50%]">
                  {taggedUsers.map((username) => (
                    <span
                      key={username}
                      className="bg-[#978f8f4a] text-gray-300 px-2 py-1 h-6 rounded-full text-[9px]"
                    >
                      @{username} &nbsp;
                      <span
                        onClick={() => handleRemoveTag(username)}
                        className="text-[10px] cursor-pointer"
                      >
                        x
                      </span>
                    </span>
                  ))}
                </div>

                <div className="flex justify-end px-2 py-1">
                  <div className="relative mr-3 flex">
                    {showInput && (
                      <div className="relative flex w-full mr-3">
                        <input
                          className="border border-white border-opacity-40 bg-transparent rounded-xl px-3 py-1 w-full"
                          type="text"
                          id="tags"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Type username to tag..."
                          autoFocus
                        />

                        {/* Showing the Tag suggestions Dropdown. */}

                        {userSuggestions.length > 0 && (
                          <ul className="absolute bottom-full mb-2 bg-gray-950 border border-gray-400 shadow-lg max-h-40 overflow-y-auto z-10 w-full mr-3 custom-scrollbar">
                            {userSuggestions.map((username) => (
                              <li
                                key={username}
                                className="p-2 text-sm cursor-pointer border border-gray-700 border-opacity-30"
                                onClick={() => handleAddTag(username)}
                              >
                                @{username}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    <div
                      className="cursor-pointer rounded-full transition-all inline-block text-yellow-600 hover:text-cyan-700"
                      onClick={() => setShowInput((prev) => !prev)}
                    >
                      <FaUserTag className="text-3xl " />
                    </div>
                  </div>

                  {/* Adding image to the post. */}
                  <div>
                    <input
                      type="file"
                      id="imageFile"
                      onChange={handleFileChangeWithPreview}
                      accept="image/*"
                      className="hidden"
                      key={fileInputKey}
                    />
                    <label
                      htmlFor="imageFile"
                      className="cursor-pointer text-blue-500 flex items-center rounded-lg hover:text-gray-300 transition-all duration-300 w-fit"
                    >
                      <FiImage className="text-3xl" />
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className=" w-full border border-black py-3 transition-all duration-400 rounded-xl mt-5 bg-[#0c45ff53] hover:bg-[#0c45ff7b]"
              >
                {loading ? (
                  <TbLoaderQuarter className="text-lg animate-spin mx-auto" />
                ) : (
                  "Post"
                )}
              </button>
            </form>
          </div>
          <DrawerFooter>
            <DrawerClose></DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CreatePostCard;
