import React, { useState, useRef } from 'react';

interface FileUploadProps {
  icon?: React.ReactNode;
  buttonText?: string;
  modalClassName?: string;
  buttonClassName?: string;
  setPreview?: (previewUrl: string) => void;
  fileSetter: (file: File | null) => void
}

const UploadGigImg: React.FC<FileUploadProps> = ({
  icon = '📁',
  buttonText = 'Subir archivo',
  modalClassName = '',
  buttonClassName = '',
  setPreview,
  fileSetter
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeletePhoto = () => {
    setPreviewUrl('');
    setSelectedFile(null);
    setPreview?.('');
    fileSetter(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      fileSetter(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          setPreviewUrl(url);
          setPreview?.(url);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      fileSetter(file);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          setPreviewUrl(url);
          setPreview?.(url);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        className={buttonClassName}
      >
        <span>{icon}</span>
        <span>{buttonText}</span>
      </button>

      {isModalOpen && (
        <div
          className="
          fixed 
          inset-0 
          bg-black/50
          flex 
          items-center 
          justify-center 
          z-50 
          p-4
        ">
          <div
            className={`
            bg-card 
            text-card-foreground
            rounded-xl 
            shadow-2xl 
            w-full 
            max-w-md 
            ${modalClassName}
          `}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Subir archivo</h2>
              <button
                onClick={handleCloseModal}
                className="
                  text-muted-foreground 
                  hover:text-foreground 
                  transition-colors 
                  disabled:opacity-50
                "
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className="
                border-2 
                border-dashed 
                border-border 
                rounded-lg 
                p-8 
                text-center 
                cursor-pointer 
                hover:border-primary 
                transition-colors 
                bg-muted
              "
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*"
                />

                {!selectedFile ? (
                  <div className="space-y-3">
                    <svg
                      className="w-12 h-12 mx-auto text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="
                        M7 16a4 4 0 01-.88-7.903A5
                        5 0 1115.9 6L16 6a5 5 0 011
                        9.9M15 13l-3-3m0 0l-3 3m3-3v12
                      "/>
                    </svg>
                    <p className="text-foreground font-medium">
                      Haz click o arrastra un archivo aquí
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Cualquier tipo de imagen
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {previewUrl && (
                      <div className="flex justify-center">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-32 max-w-full rounded-lg object-contain"
                        />
                      </div>
                    )}
                    <p className="text-foreground font-medium truncate">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div
              className="
              flex 
              justify-between 
              gap-3 
              p-6 
              border-t 
              border-border 
              bg-muted 
              rounded-b-xl
            ">
              <button
                onClick={handleDeletePhoto}
                disabled={!selectedFile}
                className="
                px-4 
                py-2 
                text-muted-foreground 
                hover:text-foreground 
                font-medium 
                disabled:opacity-50 
                disabled:cursor-not-allowed 
                transition-colors 
                border 
                border-border 
                rounded-lg
              ">
                Borrar
              </button>
              <button
                onClick={handleCloseModal}
                disabled={!selectedFile}
                className="
                px-4 
                py-2 
                bg-primary 
                text-primary-foreground 
                rounded-lg 
                hover:opacity-90
                disabled:opacity-50 
                disabled:cursor-not-allowed 
                transition-colors 
                font-medium
              "
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

};

export default UploadGigImg;