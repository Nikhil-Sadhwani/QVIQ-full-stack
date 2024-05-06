import { FC, useContext, useEffect, useState } from "react";
import { auth, deleteAccount, logOut } from "../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { userContext } from "../context/UserContext";
import QRCode from "qrcode";
import "../CSS/Photo.css";

const Home: FC = () => {
  const params = new URLSearchParams(window.location.search);
  const userid = params.get("userid");
  const [user, loading] = useAuthState(auth);
  const context = useContext(userContext);
  const [showPopUp, setShowPopUp] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    profileURL: "",
    uid: "",
    phoneNumber: "",
    coverURL: "",
  });

  const [qrSrc, setQrSrc] = useState("");

  const generate = (uid: string) => {
    QRCode.toDataURL(
      `${process.env.REACT_APP_LINK_URL}home?userid=${uid}`
    ).then(setQrSrc);
  };

  const fetchData = async (
    url: string,
    email?: string | null,
    uid?: string
  ) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      const data = await response.json();
      setData({
        name: data.name,
        email: email || data.email,
        uid: uid || context?.value?.uid,
        profileURL: data.displayPicture,
        coverURL: data.coverPicture,
        phoneNumber: data.phoneNumber || "0000000000",
      });
      generate(uid || context?.value?.uid);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (loading) return;

    if (!userid) {
      if (!user) navigate("/");
      if (user) {
        fetchData(
          `${process.env.REACT_APP_BASE_URL}user/${user.uid}`,
          user.email,
          user.uid
        );
      }
    } else {
      fetchData(`${process.env.REACT_APP_BASE_URL}user/${userid}`);
    }
    // eslint-disable-next-line
  }, [user, loading]);

  const handleDelete = async () => {
    await fetch(`${process.env.REACT_APP_BASE_URL}user/${data.uid}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
    })
      .then((res) => {
        deleteAccount();
        console.log("Delete account");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="bg-zinc-200 min-h-screen flex flex-col">
      {showPopUp && (
        <div
          className={`bg-white p-4 rounded-3xl shadow-lg flex items-center justify-center space-x-4 
        flex-col flex-wrap absolute top-[50%] z-10 w-full  sm:w-auto sm:left-[30%] md:left-[38%]`}
        >
          <div className="text-lg mb-3">
            Are you sure to delete your account ?
          </div>

          <div className="flex items-center justify-start gap-3 mb-3 flex-row">
            <button className="  font-bold py-2 px-5" onClick={handleDelete}>
              Yes
            </button>
            <button
              className=" font-bold py-2 px-5"
              onClick={() => {
                setShowPopUp(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      )}
      <div className="h-[242px] sm:h-auto">
        <div
          className={`h-[15rem] bg-cover bg-center sm:h-[25rem]`}
          style={{ backgroundImage: `url(${data.coverURL})` }}
        ></div>
        <div
          className={`relative flex flex-col gap-0 top-[-124px] left-0 p-4 flex-wrap justify-center items-center sm:absolute sm:flex-row sm:justify-normal sm:item-none sm:gap-16 sm:top-[15rem] sm:ml-[35px] sm:left-4`}
        >
          <img
            src={data.profileURL}
            alt="Profile logo"
            className="mb-2 w-[12rem] "
          />
          <div className="h-[100px] w-auto mt-0 text-center sm:text-left sm:mt-[30px] ">
            <h2 className="text-2xl font-bold text-black sm:text-white">
              {data.name}
            </h2>
            <p className="text-lg  text-black sm:text-white ">
              {data.email} , +91 - {data.phoneNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md py-2 h-auto flex-grow">
        <div className=" px-4 flex space-x-2 mr-3 justify-center mt-[185px] sm:justify-end sm:mt-0">
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-5 rounded "
            onClick={() => {
              navigate(`/edit/${data.uid}`);
            }}
          >
            Edit
          </button>
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-5 rounded "
            onClick={() => {
              setShowPopUp(true);
            }}
          >
            Delete
          </button>
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-5 rounded "
            onClick={logOut}
          >
            Logout
          </button>
        </div>
        <div className="flex mt-2 mr-3 justify-center sm:justify-end">
          <img src={qrSrc} alt="qrcode" />
        </div>
      </div>
    </div>
  );
};

export default Home;
