"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter,useParams } from "next/navigation";
import { IoArrowBack,IoSave  } from "react-icons/io5";
import 'react-toastify/dist/ReactToastify.css';
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
const Froala = dynamic(() => import("react-froala-wysiwyg"), { ssr: false });

const froalaEditorConfig = {
    attribution: false,
    quickInsertEnabled: false,
    imageDefaultWidth: 0,
    imageUploadRemoteUrls: true,
    imageResizeWithPercent: true,
    imageMultipleStyles: false,
    imageOutputSize: true,
    imageRoundPercent: true,
    imageEditButtons: [
        "imageReplace",
        "imageAlign",
        "imageRemove",
        "imageSize",
        "-",
        "imageLink",
        "linkOpen",
        "linkEdit",
        "linkRemove"
    ],
    fontFamilySelection: true,
    fontFamily: { 'Arial,Helvetica,sans-serif': 'Arial', 'Georgia,serif': 'Georgia', 'Impact,Charcoal,sans-serif': 'Impact', 'Tahoma,Geneva,sans-serif': 'Tahoma', "'Times New Roman',Times,serif": 'Times New Roman', 'Verdana,Geneva,sans-serif': 'Verdana' },
    imageAllowedTypes: ["jpeg", "jpg", "png", "gif"],
    imageInsertButtons: ["imageBack", "|", "imageUpload", "|", "imageByURL"],
    placeholderText: "@Nhập nội dung chương tại đây",
    colorsStep: 5,
    colorsText: ["#000000", "#2C2E2F", "#6C7378", "#FFFFFF", "#009CDE", "#003087", "#FF9600", "#00CF92", "#DE0063", "#640487", "REMOVE"],
    colorsBackground: ["#000000", "#2C2E2F", "#6C7378", "#FFFFFF", "#009CDE", "#003087", "#FF9600", "#00CF92", "#DE0063", "#640487", "REMOVE"],
    toolbarButtons: {
        moreRich: {
            buttons: ["bold", "italic", "underline", "insertHR", "insertLink", "insertTable", "|",],
            name: "additionals",
            buttonsVisible: 3
        },
        moreText: {
            buttons: [
                "fontFamily",
                "|",
                "paragraphFormat",
                "|",
                "fontSize",
                "textColor",
                "backgroundColor",
                "insertImage",
                "alignLeft",
                "alignRight",
                "alignJustify",
                "formatOL",
                "formatUL",
                "indent",
                "outdent"
            ],
            buttonsVisible: 6
        },
        moreMisc: {
            buttons: ["undo", "redo", "help", "|"],
            align: "right",
            buttonsVisible: 2
        }
    },
    events: {
        "image.beforeUpload": function (this: any, files: FileList) {
            const editor = this;
            if (files.length) {
                const reader = new FileReader();
                reader.onload = function (e: ProgressEvent<FileReader>) {
                    const result = e.target?.result;
                    editor.image.insert(result as string, null, null, editor.image.get());
                };
                reader.readAsDataURL(files[0]);
            }
            editor.popups.hideAll();
            return false;
        }
    }
};

export default function page(): React.ReactElement {
    const params = useParams<{ khoahoc: string }>();
    const router = useRouter();
    const [model, setModel] = React.useState<string>("");
    const [title, setTitle] = React.useState<string>("New Page");

    const onModelChange = (newModel: string) => {
        setModel(newModel);
    };

    const handleSavemodel = async () => {
        try {
            const author = Cookies.get("name");
            const dataToSend = {
                title: title, 
                content: model,
                tacgia: author,
                id_khoahoc: params?.khoahoc,
            };
            const chapter_id = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/giangvien/taochuong`, dataToSend);
            router.push(`/books/${params?.khoahoc}/${chapter_id?.data?.id_chuong}`)
        } catch (error) {
            console.error("Error saving model:", error);
        }
    };
    
    return (
        <div className="bg-white border rounded-lg shadow-md p-5 h-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 hover:bg-gray-200 p-2 rounded-lg" onClick={() => {
                        router.back();
                    }}>
                        <IoArrowBack fontWeight={500} size={30} />
                        <span className="text-xl font-bold">Trở lại</span>
                    </button>
                </div>

                <div className="flex space-x-3">
                    <button className="text-green-600 hover:text-green-800 flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-lg" onClick={handleSavemodel}>
                        <IoSave fontWeight={500} size={26} />
                        <span className="text-xl font-bold">Lưu</span>
                    </button>
                </div>
            </div>
            <input
                type="text"
                value={title} // Sử dụng giá trị từ state
                className="w-full p-3 mb-4 text-2xl font-semibold border-b-2 border-gray-300 rounded-xl focus:outline-none"
                onChange={(e) => setTitle(e.target.value)} // Cập nhật state khi có thay đổi
                onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Froala
                tag="textarea"
                model={model}
                onModelChange={onModelChange}
                config={froalaEditorConfig}
            />
        </div>
    );
}