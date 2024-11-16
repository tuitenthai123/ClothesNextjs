"use client";
import * as React from "react";
import { LuWalletCards } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileInput, Label } from "flowbite-react";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/bookcard";
import Cookies from "js-cookie";
import axios from "axios";
import { generateRandomId } from "@/lib/randomID";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "@/lib/firebase_config";
import { useRouter } from "next/navigation";

export default function FroalaEditor(): React.ReactElement {
  const firstUpdate = React.useRef(true);
  const [title, setTitle] = React.useState<string>("");
  const [id_project, setid_project] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [image, setImage] = React.useState<string | null>(null);
  const [datakhoahoc, setdatakhoahoc] = React.useState({
    title: "",
    description: "",
    image: "",
    create_Time: "",
    update_Time: "",
    author: Cookies.get("name"),
    id_project: ""
  });

  const route = useRouter();

  React.useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    } else {
      handleSave();
    }
  }, [image]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const IDproject = await generateRandomId(6);
    setid_project(IDproject);
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
            setImage(downloadURL);
          });
        }
      );
    }
  };

  const handleSave = async () => {
    const data = {
      title,
      description,
      image: image || "",
      create_Time: new Date().toISOString(), // Chuyển đổi thành chuỗi ISO
      update_Time: new Date().toISOString(), // Chuyển đổi thành chuỗi ISO
      author: Cookies.get("name"),
      id_project
    };
    setdatakhoahoc(data);
  };

  const handleSaveChange = async () => {
    try {
      const data = {
        title,
        description,
        image: image || "",
        create_Time: new Date().toISOString(), // Chuyển đổi thành chuỗi ISO
        update_Time: new Date().toISOString(), // Chuyển đổi thành chuỗi ISO
        author: Cookies.get("name"),
        masv: Cookies.get("mssv"),
        id_project
      };
      setdatakhoahoc(data);
      await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/giangvien/taokhoahoc`, data);
      route.push(`${process.env.NEXT_PUBLIC_HOST}/books/${id_project}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-500/10 p-10 px-14 h-full">
      <div className="flex flex-col gap-2 border bg-white p-10 rounded-sm shadow-sm">
        <span className="text-2xl text-blue-600 font-bold flex gap-2 items-center">
          <LuWalletCards /> Thông tin khóa học
        </span>
        <div>
          <div className="p-3 flex flex-col gap-3">
            <div className="grid w-full items-center gap-1.5">
              <Label className="text-xl font-bold">Tiêu đề</Label>
              <Input
                className="w-full text-xl h-auto"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label className="text-xl font-bold">Mô tả</Label>
              <Textarea
                className="h-auto text-lg text-gray-500/85"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label className="text-xl font-bold">Ảnh mô tả</Label>
              <FileInput
                id="default-file-upload"
                placeholder="Chọn ảnh"
                onChange={handleImageChange}
              />
            </div>
            <div className="flex items-center justify-center">
              {image && (
                <div className="mx-2">
                  <BookCard
                    author={datakhoahoc.author || ""}
                    createdTime={datakhoahoc.create_Time || new Date().toISOString()}
                    updatedTime={datakhoahoc.update_Time || new Date().toISOString()}
                    description={datakhoahoc.description}
                    image={image || ""}
                    title={datakhoahoc.title}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="grid place-items-end">
            <div className="flex gap-5">
              <Button variant={"outline"} onClick={()=>{route.push("/giangvien/manager")}}>Hủy</Button>
              <Button onClick={handleSaveChange}>Lưu chương</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
