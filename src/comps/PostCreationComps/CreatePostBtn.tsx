// This file contains the code for the Create Post button which will trigger the Create post Card component to be displayed.

import React from "react";
import { IoCreateOutline } from "react-icons/io5";

const CreatePostBtn = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ ...props }, ref) => {
  return (
    <button
      ref={ref}
      className="bg-green-800 hover:bg-green-900 flex items-center justify-center gap-1 py-2 px-4 rounded-2xl transition-all duration-300"
      {...props}
    >
      <IoCreateOutline className="text-lg" /> Create Post
    </button>
  );
});

CreatePostBtn.displayName = "CreatePostBtn";

export default CreatePostBtn;
