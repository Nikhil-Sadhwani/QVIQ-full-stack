import React, { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../Firebase";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../context/UserContext";

export default function Login() {
  const [user, loading, error] = useAuthState(auth);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const context = useContext(userContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate("/home");
      context?.setValue({ email: user.email, uid: user.uid });
    }

    // eslint-disable-next-line
  }, [user, loading]);

  return (
    <>
      <div className="flex h-[calc(100vh-80px)] w-screen justify-center items-center">
        <div className="flex flex-col space-y-3 bg-white p-10 rounded-xl">
          <input
            type="text"
            className="outline-none bg-white text-black p-3 rounded-lg border-2 border-gray-700 font-semibold w-[300px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
          />
          <input
            type="password"
            className="outline-none bg-[white] text-black p-3 rounded-lg border-2 border-gray-700 font-semibold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 font-bold px-5 py-2 rounded-full text-white"
            onClick={() => logInWithEmailAndPassword(email, password)}
          >
            Login
          </button>
          <button
            className="border-2 bg-white border-gray-700 font-semibold px-5 py-2 rounded-full flex space-x-2 items-center justify-center"
            onClick={signInWithGoogle}
          >
            <p>Login with</p>
            <img
              className="h-5 w-5"
              src="https://www.transparentpng.com/thumb/google-logo/google-logo-png-icon-free-download-SUF63j.png"
              alt=""
            />
          </button>
          <div className="flex flex-col items-center">
            {/* <div>
            <Link to="/reset" className="underline text-blue-500">
              Forgot Password
            </Link>
          </div> */}
            <div>
              Don't have an account?{" "}
              <Link to="/register" className="underline text-blue-500">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
