// This file contains code for the Navigation bar of the application.

import { useAuth } from "../hooks/useAuth";

const NavBar = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="flex justify-between">
      <h2 className="text-xl w-3/4 md:text-3xl mb-5 ">
        Hey {user?.user_metadata.username || "there"} ! What's new? 👀
      </h2>
      <button
        onClick={handleSignOut}
        className="h-8 w-20 md:h-10 md:w-24 border border-red-800 bg-[#80121268] rounded hover:bg-red-800 transition-all duration-300"
      >
        Sign Out
      </button>
    </div>
  );
};

export default NavBar;
