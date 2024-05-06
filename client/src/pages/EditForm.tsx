import React from "react";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth, storage } from "../Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EditForm() {
  const { uid } = useParams<string>();
  const [user, loading] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [image, setimage] = useState<string | any>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [coverImage, setCoverImage] = useState<string | any>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/");
  }, [user, loading]);

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

      console.log(selectedFile);
    } else {
      alert("No file Selected, soo select one!");
      console.log("No file Selected, soo select one!");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = event.target.value.replace(/\D/g, "");
    setPhoneNumber(newNumber);
  };

  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      const data = await response.json();
      setName(data.name);
      setEmail(data.email);
      setPhoneNumber(data.phoneNumber);
      setimage(data.displayPicture);
      setCoverImage(data.coverPicture);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData(`${process.env.REACT_APP_BASE_URL}user/${uid}`);
  }, []);

  const updateUserInfo = async () => {
    await fetch(`${process.env.REACT_APP_BASE_URL}user/${uid}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
        email,
        phoneNumber,
        displayPicture: image,
        coverPicture: coverImage,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then(() => {
        console.log("User updated sucessfully");
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex h-[calc(100vh-80px)] w-screen justify-center items-center">
      <div className="flex flex-col space-y-3 bg-white p-10 rounded-xl">
        <div className="flex space-x-2 items-center mb-2">
          <p className="font-semibold">Profile Picture : </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              handleFileUpload(e, setimage);
            }}
            className="block text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
          />

          {image && (
            <div className="w-[100px] h-[100px]">
              <img
                src={image instanceof Blob ? URL.createObjectURL(image) : image}
                alt="Uploaded Image"
              />
            </div>
          )}
        </div>
        <div className="flex space-x-2 items-center mb-2">
          <p className="font-semibold">Cover Picture : </p>
          <input
            type="file"
            accept="image/*"
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
          {/* {!isValid && (
            <p className="text-red-500 text-xs ml-2">
              Please enter a valid 10-digit phone number.
            </p>
          )} */}
        </div>
        <input
          type="text"
          className="outline-none bg-[white] text-black p-3 rounded-lg border-2 border-gray-700 font-semibold"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />

        <button
          className="bg-gradient-to-r from-blue-500 to-purple-500 font-bold px-5 py-2 rounded-full text-white"
          onClick={updateUserInfo}
        >
          Save
        </button>
        <button
          onClick={() => {
            navigate("/home");
          }}
        >
          <div className="border-2 bg-white border-gray-700 font-semibold px-5 py-2 rounded-full flex space-x-2 items-center justify-center">
            Cancel
          </div>
        </button>
      </div>
    </div>
  );
}
