// This file contains the code for the Login component to help the user in signing in to their account using email and password.

import React from "react";
import { TbLoaderQuarter } from "react-icons/tb";

interface SignupProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSignup: () => void;

  setNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

const Signup: React.FC<SignupProps> = ({
  name,
  setName,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  handleSignup,

  setNewUser,
  loading,
}) => {
  return (
    <div>
      <h2 className="text-3xl  text-center mb-6 text-white">
        Create a new Account
      </h2>
      <div className="flex flex-col gap-5 ">
        <input
          className="bg-[#110e3a] h-12 rounded-xl p-4"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="bg-[#110e3a] h-12 rounded-xl p-4"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="bg-[#110e3a] h-12 rounded-xl p-4"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="bg-[#110e3a] h-12 rounded-xl p-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          disabled={loading}
          className={`bg-transparent border border-orange-600 h-12 hover:bg-orange-600 transition-all duration-300  ${
            loading && "opacity-70 text-gray-400"
          }`}
          onClick={handleSignup}
        >
          {loading ? (
            <>
              Creating your Account... &nbsp;
              <TbLoaderQuarter className="animate-spin inline-block" />
            </>
          ) : (
            "Sign up"
          )}
        </button>
      </div>
      <div className="mt-2 text-sm">
        Already a user?
        <span
          className="text-blue-700 cursor-pointer"
          onClick={() => setNewUser(false)}
        >
          {" "}
          Log in here
        </span>
      </div>
    </div>
  );
};

export default Signup;
