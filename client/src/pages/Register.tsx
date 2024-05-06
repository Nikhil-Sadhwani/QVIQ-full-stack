import { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
  storage,
} from "../Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { userContext } from "../context/UserContext";

export default function Register() {
  const [user, loading] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState<string | any>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [coverImage, setCoverImage] = useState<string | any>("");
  const context = useContext(userContext);
  const navigate = useNavigate();

  const handleFileUpload = (event: any, setFunc: (obj: string) => void) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageRef = ref(storage, `images/${selectedFile.name}`);
      uploadBytes(imageRef, selectedFile).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("Image url ", downloadURL);
          setFunc(downloadURL);
        });
      });
    } else {
      alert("No file Selected, soo select one!");
      console.log("No file Selected, soo select one!");
    }
  };

  const register = () => {
    registerWithEmailAndPassword(
      name,
      email,
      password,
      profileImage,
      phoneNumber,
      coverImage
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = event.target.value.replace(/\D/g, "");
    setPhoneNumber(newNumber);
  };

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate("/home");
      context?.setValue({ email: user.email, uid: user.uid });
    }
    // eslint-disable-next-line
  }, [user, loading]);

  return (
    <div className="flex  w-screen justify-center items-center mt-[30px] mb-[30px] sm:mt-0 sm:h-[700px]">
      <div className="flex flex-col space-y-4 bg-white p-10 rounded-xl w-[500px] sm:w-auto">
        <div className="flex space-x-2 items-center mb-3 flex-col sm:flex-row">
          <div className="flex space-y-2 space-x-2 items-center flex-col mb-2 sm:flex-row">
            <p className="font-semibold">Profile Picture : </p>
            <input
              type="file"
              onChange={(e) => {
                handleFileUpload(e, setProfileImage);
              }}
              className="block text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
            />
          </div>
          {profileImage && (
            <div className="w-[100px] h-[100px]">
              <img
                src={
                  profileImage instanceof Blob
                    ? URL.createObjectURL(profileImage)
                    : profileImage
                }
                alt="Uploaded Image"
              />
            </div>
          )}
        </div>
        <div className="flex space-x-2 items-center mb-3 flex-col sm:flex-row">
          <div className="flex space-y-2 space-x-2 items-center flex-col mb-2 sm:flex-row">
            <p className="font-semibold">Cover Picture : </p>
            <input
              type="file"
              onChange={(e) => {
                handleFileUpload(e, setCoverImage);
              }}
              className="block text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
            />
          </div>
          {coverImage && (
            <div className="w-[100px] h-[100px]">
              <img
                src={
                  coverImage instanceof Blob
                    ? URL.createObjectURL(coverImage)
                    : coverImage
                }
                alt="Uploaded Image"
              />
            </div>
          )}
        </div>
        <input
          type="text"
          className="outline-none bg-[white] text-black p-3 rounded-lg border-2 border-gray-700 font-semibold"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <div
          className={`flex items-center w-full outline-none bg-[white] text-black p-3 rounded-lg border-2 border-gray-700 font-semibold `}
        >
          <span className="mr-2 text-gray-500">+91</span>
          <input
            type="tel"
            className="w-full border-l-2 border-gray-400 pl-1 focus:outline-none"
            placeholder="Enter phone number"
            value={phoneNumber}
            maxLength={10}
            onChange={handleChange}
          />
        </div>
        <input
          type="text"
          className="outline-none bg-[white] text-black p-3 rounded-lg border-2 border-gray-700 font-semibold"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
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
          onClick={register}
        >
          Register
        </button>
        <button onClick={signInWithGoogle}>
          <div className="border-2 bg-white border-gray-700 font-semibold px-5 py-2 rounded-full flex space-x-2 items-center justify-center">
            <p>Register with Google</p>
            <img
              className="h-5 w-5"
              src="https://www.transparentpng.com/thumb/google-logo/google-logo-png-icon-free-download-SUF63j.png"
              alt=""
            />
          </div>
        </button>
        <div style={{ marginTop: "20px" }} className="text-center">
          Already have an account?{" "}
          <Link to="/" className="underline text-blue-500">
            Login
          </Link>{" "}
          now.
        </div>
      </div>
    </div>
  );
}
