
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyCPdmkbABw5OISRVHeaIpOSgJryIY6zc3Q",
  authDomain: "b4mart-c3a7d.firebaseapp.com",
  projectId: "b4mart-c3a7d",
  storageBucket: "b4mart-c3a7d.appspot.com",
  messagingSenderId: "523603666040",
  appId: "1:523603666040:web:ed0488d69d6f0d397cb98d",
  measurementId: "G-CYXCY38MWC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);

