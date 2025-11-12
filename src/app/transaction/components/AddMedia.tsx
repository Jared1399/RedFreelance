'use client';
import { watermarkImg } from "@/lib/watermarkImg";
import { useEffect, useRef, useState } from "react";

interface AddMediaProps {
  onFileChange: (file: File | null) => void;
  reset?: boolean;

}

const watermarkSvg = "/watermark.svg";

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (file && file.type.startsWith('image/')) {
      try {
        const processedFile = await watermarkImg(file, watermarkSvg);
        setSelectedFile(processedFile);
        setPreview(URL.createObjectURL(processedFile));
        onFileChange(processedFile);
      } catch (error) {
        console.error('Error procesando imagen:', error);
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        onFileChange(file);
      }
    } else {
      setSelectedFile(file);
      setPreview(file ? URL.createObjectURL(file) : null);
      onFileChange(file);
    }
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
            bg-muted 
            border-t 
            border-border
          "
        >
          <div>
            <p className="text-sm text-foreground">Vista previa:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-[75px] h-[75px] object-cover rounded-lg border border-border"
            />
          </div>
          <span className="text-sm text-muted-foreground max-w-[180px] truncate">
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
            className="text-sm text-accent hover:text-ring transition-colors"
          >
            Eliminar
          </button>
        </div>
      )}
      <button
        onClick={openFileDialog}
        className="
          bg-muted 
          text-foreground
          border 
          border-border
          px-4 
          py-2 
          mx-2 
          rounded-lg 
          cursor-pointer
          hover:bg-muted-foreground/50
          hover:text-accent-foreground
          transition-colors
        ">
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
