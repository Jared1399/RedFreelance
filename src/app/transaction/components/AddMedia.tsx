'use client';
import { useEffect, useRef, useState } from "react";
interface AddMediaProps {
  onFileChange: (file: File | null) => void;
  reset?: boolean;

}

export default function AddMedia({ onFileChange, reset }: AddMediaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const openFileDialog = () => fileInputRef.current?.click();


  useEffect(() => {
    if (reset) {
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
    onFileChange(file);
  };

  return (
    <>
      {selectedFile && preview && (
        <div
          className="
          flex 
          items-center 
          space-x-2 
          absolute 
          bottom-18 
          left-0 
          w-full 
          py-5 
          px-6 
          bg-neutral-700"
        >
          <div>
            <p>Vista previa:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-[75px] h-[75px] object-cover rounded-lg"
            />
          </div>
          <span className="text-sm text-neutral-300 max-w-[180px] truncate">
            {selectedFile.name}
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              setPreview(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
              onFileChange(null);
            }}
            className="text-sm text-amber-600 hover:text-amber-500"
          >
            Eliminar
          </button>
        </div>
      )}
      <button
        onClick={openFileDialog}
        className="bg-neutral-300 outline px-4 py-2 mx-2 rounded-lg cursor-pointer"
      >
        📎
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
