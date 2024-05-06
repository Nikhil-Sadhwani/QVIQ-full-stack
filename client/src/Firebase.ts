import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
} from "firebase/firestore";

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_Measurement_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const registerUserToMongo = async (
  name: string | null,
  email: string | null,
  uid: string | null,
  displayPicture: string | null,
  phoneNumber: string | null,
  coverPicture?: string | null
) => {
  await fetch(`${process.env.REACT_APP_BASE_URL}auth/register`, {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      uid,
      displayPicture,
      phoneNumber,
      coverPicture,
    }),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then(() => {
      console.log("User registered sucessfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const signInWithGoogle = async () => {
  try {
    const response = await signInWithPopup(auth, googleProvider);
    const user = response.user;
    console.log("Google details", user);

    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await registerUserToMongo(
        user.displayName,
        user.email,
        user.uid,
        user.photoURL,
        user.phoneNumber
      );
    }
  } catch (err) {
    console.log(err);
    // alert(err.message);
  }
};

export const logInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.log(err);
    // alert(err.message);
  }
};

export const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string,
  displayPicture: string,
  phoneNumber: string,
  coverPicture: string
) => {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = response.user;
    const profilePic = displayPicture
      ? displayPicture
      : "https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg";
    const coverPic = coverPicture ? coverPicture : "";

    await registerUserToMongo(
      name,
      email,
      user.uid,
      profilePic,
      phoneNumber,
      coverPic
    );
  } catch (err) {
    console.log(err);
    // alert(err.message);
  }
};

export const logOut = () => {
  signOut(auth);
};

export const deleteAccount = async () => {
  const user = auth?.currentUser;
  if (user) {
    deleteUser(user)
      .then(() => {
        console.log("Delete account");
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
