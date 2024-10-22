"use server"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "./firebase_config";
import { generateRandomId } from "./randomID";

export const uploadImage = async (file: File): Promise<{ id_project: string, downloadURL: string }> => {
    try {
      const IDproject = await generateRandomId(6);
      const storageRef = ref(storage, `images/${IDproject}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Upload failed:", error);
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve({ id_project: IDproject, downloadURL });
            });
          }
        );
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  export const updateImage = async (file: File): Promise<{ id_project: string, downloadURL: string }> => {
    try {
      const IDproject = await generateRandomId(6);
      const storageRef = ref(storage, `images/${IDproject}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Upload failed:", error);
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve({ id_project: IDproject, downloadURL });
            });
          }
        );
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };