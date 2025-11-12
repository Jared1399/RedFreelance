"use client";
import React from 'react';
import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';

const infoToast = () => toast.info(
  'Imagen preparada para guardar',
  {
    position: 'bottom-right',
    autoClose: 2000,
    theme: 'dark'
  }
);

export default function UpdateProfilePic(
  { onFileSelected }: { onFileSelected?: (file: File | null) => void }
) {

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      if (onFileSelected) onFileSelected(file);
    }
  }

  useEffect(() => {
    return () => {
      if (preview) {
        try {
          URL.revokeObjectURL(preview);
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, [preview]);

  return (
    <div className="flex flex-row justify-between w-170">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <input
            ref={fileInputRef}
            id="profilePic"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <label
            htmlFor="profilePic"
            className="
              inline-flex 
              items-center 
              px-4 
              py-2 
              bg-primary 
              hover:bg-primary/90 
              text-primary-foreground 
              rounded-full 
              cursor-pointer
              shadow-sm
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                d="M4 3a2 2 0 00-2 2v10a2 2 0 
              002 2h12a2 2 0 002-2V7.414A2 
              2 0 0016.414 6L13 2.586A2 2 0 
              0011.586 2H4z"
              />
            </svg>
            <span className="ml-2 text-sm font-medium">Seleccionar imagen</span>
          </label>

          {selectedFile ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground max-w-[180px] truncate">
                {selectedFile.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  if (onFileSelected) onFileSelected(null);
                }}
                className="text-sm text-primary hover:text-primary/90"
              >
                Eliminar
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            disabled={!selectedFile}
            onClick={() => {
              if (!selectedFile) return;
              if (onFileSelected) onFileSelected(selectedFile);
              infoToast();
            }}
            className="
              px-4 
              py-2 
              bg-primary 
              hover:bg-primary/90 
              text-primary-foreground 
              rounded-md 
              disabled:opacity-50 
              disabled:cursor-not-allowed
            "
          >
            Cargar imagen
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              setPreview(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
              if (onFileSelected) onFileSelected(null);
            }}
            className="
              px-3 
              py-2 
              bg-transparent 
              border 
              border-border 
              text-muted-foreground 
              hover:border-border/80 
              rounded-md
              text-sm
            "
          >
            Cancelar
          </button>
        </div>
      </div>
      {preview && (
        <div className="text-muted-foreground">
          <p>Vista previa:</p>
          <img
            src={preview}
            alt="Preview"
            className="w-[100px] h-[100px] object-cover rounded-full border border-border"
          />
        </div>
      )}
      <ToastContainer />
    </div>


  );
}