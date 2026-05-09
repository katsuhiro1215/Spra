import { useState, useRef, useEffect } from "react";

export default function ImageUpload({ value, onChange, className = "" }) {
    const [imageSrc, setImageSrc] = useState("");
    const [active, setActive] = useState(false);
    const [dragCount, setDragCount] = useState(0);
    const inputFileRef = useRef(null);

    // 初期値として文字列パスが渡された場合の処理
    useEffect(() => {
        if (value) {
            if (typeof value === "string") {
                setImageSrc(value);
            } else if (value instanceof File) {
                setImageSrc(URL.createObjectURL(value));
            }
        }
    }, [value]);

    const onDragEnter = (e) => {
        e.preventDefault();
        setDragCount((prev) => prev + 1);
        setActive(true);
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        setDragCount((prev) => {
            const newCount = prev - 1;
            if (newCount === 0) {
                setActive(false);
            }
            return newCount;
        });
    };

    const uploadImage = (file) => {
        if (file) {
            setImageSrc(URL.createObjectURL(file));
            onChange?.(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        uploadImage(file);
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        uploadImage(file);
        setActive(false);
        setDragCount(0);
    };

    const imageStyle = imageSrc
        ? {
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
          }
        : {};

    return (
        <div className={`w-full flex justify-center ${className}`}>
            <label
                htmlFor="input-file"
                className="w-full h-80 text-center rounded-xl cursor-pointer"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
            >
                <input
                    type="file"
                    accept="image/*"
                    id="input-file"
                    onChange={handleFileChange}
                    ref={inputFileRef}
                    className="hidden"
                />
                <div
                    style={imageStyle}
                    className={`w-full h-full rounded-xl border-2 border-dashed p-4 border-blue-500 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors object-contain object-center flex flex-col items-center justify-center ${
                        active ? "bg-pink-100 dark:bg-pink-900/20" : ""
                    } ${imageSrc ? "border-none" : ""}`}
                >
                    {!imageSrc && (
                        <>
                            {/* ファイルアップロード用のsvg */}
                            <svg
                                className="w-16 h-16 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                ></path>
                            </svg>

                            <p className="text-base text-slate-700 dark:text-slate-300 mt-4">
                                Drag and drop or click here <br />
                                to upload image
                            </p>
                            <span className="block text-sm text-slate-600 dark:text-slate-400 mt-2">
                                Upload any images from desktop
                            </span>
                        </>
                    )}
                </div>
            </label>
        </div>
    );
}
