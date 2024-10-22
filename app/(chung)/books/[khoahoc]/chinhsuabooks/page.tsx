"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "@/lib/firebase_config";

interface KhoaHoc {
  id_khoa: string;
  tenchuong: string;
  mota: string;
  tentacgia: string;
  image: string;
}

export default function EditKhoaHocPage() {
  const router = useRouter();
  const params = useParams<{ khoahoc: string }>();
  const [khoahoc, setKhoaHoc] = useState<KhoaHoc | null>(null);
  const [formData, setFormData] = useState({
    id_khoa:"",
    tenchuong: "",
    mota: "",
    tentacgia: "",
    image: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/khoahoc`, {
        makhoahoc: params.khoahoc,
      });

      const courseData = response?.data?.datakhoahoc[0];
      setKhoaHoc(courseData);
      setFormData({
        id_khoa:courseData.id_khoa,
        tenchuong: courseData.tenchuong,
        mota: courseData.mota,
        tentacgia: courseData.tentacgia,
        image: courseData.image,
      });
    };

    fetchData();
  }, [params.khoahoc]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!khoahoc?.id_khoa) {
      console.error("ID khóa học không tồn tại!");
      return;
    }
  
    const IDproject = khoahoc.id_khoa;
    const files = event.target.files;
  
    if (files && files.length > 0) {
      const file = files[0];
      const storageRef = ref(storage, `images/${IDproject}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData((prevData) => ({
              ...prevData,
              image: downloadURL,
            }));
          });
        }
      );
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!khoahoc?.id_khoa) {
      console.error("ID khóa học không tồn tại!");
      return;
    }
    const updatedData = {
      id_khoa: khoahoc.id_khoa,
      tenchuong: formData.tenchuong,
      mota: formData.mota,
      tentacgia: formData.tentacgia,
      image: selectedImage ? await uploadImage(selectedImage) : formData.image 
    };
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/chinhsua/books`, updatedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      router.push(`/books/${khoahoc.id_khoa}`);
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };
  const uploadImage = async (file: File) => {
    const storageRef = ref(storage, `images/${khoahoc?.id_khoa}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };
  

  if (!khoahoc) return <div>Loading...</div>;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-semibold">Chỉnh sửa khóa học</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <div>
          <label>Tên chương</label>
          <input
            type="text"
            name="tenchuong"
            value={formData.tenchuong}
            onChange={handleInputChange}
            className="border p-2 w-full rounded-md"
            required
          />
        </div>
        <div>
          <label>Mô tả</label>
          <textarea
            name="mota"
            value={formData.mota}
            onChange={handleInputChange}
            className="border p-2 w-full rounded-md"
            rows={4}
            required
          />
        </div>
        

        {/* Image Preview and Upload */}
        <div>
          <label>Ảnh khóa học</label>
          <div className="mt-2">
            {selectedImage ? (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected Image"
                className="h-32 w-32 object-cover"
              />
            ) : (
              <img
                src={formData.image}
                alt="Current Course Image"
                className="h-32 w-32 object-cover"
              />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
}
