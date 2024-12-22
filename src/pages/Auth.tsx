// This file contains the code for the Authentication page ( login, signup ).

"use client";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Login from "../comps/AuthComponents/Login";
import Signup from "../comps/AuthComponents/Signup";
import SelectDp from "../comps/AuthComponents/SelectDp";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [newUser, setNewUser] = useState(false);
  const [selectDp, setSelectDp] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast(); // Pre designed Shadcn component to show toast on screen.

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn({ email, password });
      navigate("/feed");
    } catch (err) {
      toast({
        title: "Login Error",
        description: (err instanceof Error
          ? ` Error: ${err.message}`
          : "An unknown error occurred") as React.ReactNode,
        className: "bg-red-800 border-none py-3 rounded",
      });
      setLoading(false);
    }
  }; // This function handles the authentication of an existing user trying to log in.

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await signUp({ email, password, name, username });
      setSelectDp(true);
    } catch (err) {
      toast({
        title: "Signup Error",
        description: (err instanceof Error
          ? ` Error: ${err.message}`
          : "An unknown error occurred") as React.ReactNode,
        className: "bg-red-800 border-none py-3 rounded",
      });
      setLoading(false);
    }
  }; // This function handles the authentication of a new user trying to sign up.

  return (
    <div className="h-screen flex justify-center md:items-center">
      <div className=" md:h-[80%] flex md:w-[80%] rounded-lg bg-[#060313] shadow-[1px_1px_25px_1px_rgba(255,255,255,0.1)]">
        <div className=" md:w-1/2 p-10 md:p-14 my-auto">
          {/* Conditional rendering of Login, Signup and SelectDp components. */}
          {selectDp ? (
            <SelectDp />
          ) : newUser ? (
            <Signup
              name={name}
              setName={setName}
              username={username}
              setUsername={setUsername}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleSignup={handleSignUp}
              setNewUser={setNewUser}
              loading={loading}
            />
          ) : (
            <Login
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleLogin={handleLogin}
              setNewUser={setNewUser}
              loading={loading}
            />
          )}
        </div>
        <div className="md:w-1/2 hidden  md:block">
          <img
            src="./signup.png"
            alt=""
            className="scale-[140%]  translate-y-7"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
