// This file contains the code for the Select DP component to help the users choose a profile picture for their account if they want.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supaBaseClient"; // Supabase client import
import { useAuth } from "@/hooks/useAuth";
import { TbLoaderQuarter } from "react-icons/tb";

const SelectDp = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dpChosen, setDpChosen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuth(); // Fetching the logged in user.

  // The function to handle the preview of selected profile picture.
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setDpChosen(true);
    }
  };

  // The function to handle the process of setting the selected image as profile picture of user.

  const handleContinue = async () => {
    setLoading(true);
    if (imagePreview) {
      const file = imagePreview.split(",")[1];
      const byteCharacters = atob(file);
      const byteArray = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      const userId = user?.id;

      const filePath = `profile_pics/${userId}_${Date.now()}.jpg`;

      // Uploading the image to Supabase Storage bucket named 'profile-pictures'

      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, blob, {
          contentType: "image/jpeg",
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      let publicURL: string | null = null;

      // Getting the image URL from Supabase storage bucket after successful upload.

      const { data: publicData } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(filePath);

      publicURL = publicData.publicUrl;

      // Inserting the image URL into the 'dp_url' column in the 'users' table in the database.

      const { error: updateError } = await supabase
        .from("users")
        .update({ dp_url: publicURL })
        .eq("uid", userId);

      if (updateError) {
        throw new Error(updateError.message);
        return;
      }

      navigate("/feed");
    }
  };

  // If users skips adding profile picture, a default profile picture will be added.

  const handleSkip = () => {
    setLoading(true);
    navigate("/feed");
  };

  return (
    <div className="dp-upload-container">
      <h3 className="text-3xl text-center mb-6">Select a Profile Picture</h3>
      <div className="flex flex-col gap-5 items-center">
        {imagePreview ? (
          <div className="dp-preview">
            <img
              className="h-60 w-60 rounded-full"
              src={imagePreview}
              alt="Selected"
            />
          </div>
        ) : (
          <div className="dp-preview">
            <img
              className="h-60 w-60 rounded-full"
              src="./defaultDp.jpg"
              alt="Selected"
            />
          </div>
        )}
        <input
          type="file"
          id="file-input"
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: "none" }}
        />

        <label
          htmlFor="file-input"
          className="text-xs file-upload-label py-2 px-4 rounded cursor-pointer bg-blue-700"
        >
          {dpChosen ? "Select a different picture" : "Select a picture"}
        </label>
      </div>
      <div className="mt-10 flex gap-5">
        <button
          disabled={loading}
          className="bg-transparent border border-green-700 h-10 w-1/2 hover:bg-green-700 transition-all duration-300"
          onClick={handleContinue}
        >
          {loading ? (
            <TbLoaderQuarter className="animate-spin mx-auto" />
          ) : (
            "Continue"
          )}
        </button>
        <button
          disabled={loading}
          className="bg-transparent border border-gray-600 h-10 w-1/2 hover:bg-gray-600 transition-all duration-300"
          onClick={handleSkip}
        >
          {loading ? (
            <TbLoaderQuarter className="animate-spin mx-auto" />
          ) : (
            "Skip"
          )}
        </button>
      </div>
    </div>
  );
};

export default SelectDp;
