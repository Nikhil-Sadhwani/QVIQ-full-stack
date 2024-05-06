import { useContext, useEffect, useState } from "react";
import { auth, deleteAccount, logOut } from "../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { userContext } from "../context/UserContext";
import QRCode from "qrcode";
import "../CSS/Photo.css";

export default function Home() {
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
        logOut();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className={`flex items-center justify-center h-screen`}>
        {showPopUp && (
          <div
            className={`bg-white p-4 rounded-3xl shadow-lg flex items-center justify-center space-x-4 
        flex-col   flex-wrap absolute`}
          >
            <div className="text-lg mb-3">
              Are you sure to delete your account ?
            </div>

            <div className="flex items-center justify-start gap-3 mb-3 flex-col sm:flex-row">
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
        <div
          className={`bg-gray-100 p-4 rounded-3xl shadow-lg flex items-center justify-center space-x-4 
        flex-col  w-[85%] h-auto sm:flex-row sm:w-[58%] lg:h-[50%] gap-[20px] bg-opacity-[0.3] flex-wrap`}
        >
          <div className="tilt-box-wrap">
            <span className="t_over"></span>
            <span className="t_over"></span>
            <span className="t_over"></span>
            <span className="t_over"></span>
            <span className="t_over"></span>
            <span className="t_over"></span>
            <span className="t_over"></span>
            <span className="t_over"></span>
            <span className="t_over"></span>
            <div className="tilt-box p-1 bg-white border-4 border-white rounded-full">
              <img
                src={data.profileURL}
                alt="User Image"
                className="rounded-full"
                style={{ height: "135px" }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-start gap-3 mb-3">
              <div className="text-3xl font-semibold">{data.name}</div>
            </div>
            {/* 
            <div className="flex items-center justify-start gap-3 mb-3">
              <div className="text-lg ">{data.gender}</div>
              <div className="text-lg">{data.age}</div>
            </div> */}
            <div className="text-lg mb-3">{data.email}</div>

            <div className="text-white bg-black rounded-full text-left pl-3 w-[130px] h-7 z-10 mb-3">
              {data.phoneNumber}
            </div>
            {!userid && (
              <div className="flex items-center justify-start gap-3 mb-3 flex-col sm:flex-row">
                <button
                  className="rounded-full  bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-5"
                  onClick={() => {
                    navigate(`/edit/${data.uid}`);
                  }}
                >
                  Edit
                </button>
                <button
                  className="rounded-full  bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-5"
                  onClick={() => {
                    setShowPopUp(true);
                  }}
                >
                  Delete
                </button>
                <button
                  className="rounded-full  bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-5"
                  onClick={logOut}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          {!userid && (
            <div className="">
              <img src={qrSrc} alt="qrcode" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
