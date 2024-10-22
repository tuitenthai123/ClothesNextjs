// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDZ9BSqFzlK69Obp_hfSfHn0QVT5KSYxdU",
  authDomain: "doan2-e8d30.firebaseapp.com",
  projectId: "doan2-e8d30",
  storageBucket: "doan2-e8d30.appspot.com",
  messagingSenderId: "386846190774",
  appId: "1:386846190774:web:0707d85fc5d5092bdd8a17",
  measurementId: "G-GK8BXVCT9V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;
