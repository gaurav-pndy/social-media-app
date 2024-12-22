// This file contains the code for the Login component to help the user in signing in to their account using email and password.

import React from "react";

interface LoginProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleLogin: () => void;
  setNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

const Login: React.FC<LoginProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  setNewUser,
  loading,
}) => {
  return (
    <div>
      <h2 className="text-3xl  text-center mb-10 text-white">
        Log in to your Account
      </h2>
      <div className="flex flex-col gap-8 ">
        <input
          className="bg-[#110e3a] h-14 rounded-xl p-4"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="bg-[#110e3a] h-14 rounded-xl p-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          disabled={loading}
          className="bg-transparent border border-blue-800 h-12 hover:bg-blue-800 transition-all duration-300"
          onClick={handleLogin}
        >
          {loading ? "Taking you to your feed..." : "Login"}
        </button>
      </div>
      <div className="mt-2 text-sm">
        Dont have an Account ?
        <span
          className="text-yellow-600 cursor-pointer"
          onClick={() => setNewUser(true)}
        >
          {" "}
          Sign up here
        </span>
      </div>
    </div>
  );
};

export default Login;
