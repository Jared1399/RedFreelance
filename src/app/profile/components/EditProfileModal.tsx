"use client";

import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { UserData } from "../types/User";
import UpdateProfilePic from "./UpdateProfilePic";
import userProfileService from "../userProfile.service";

const successNotify = () => toast.success('Solicitud enviada!', {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  pauseOnHover: true,
  theme: "dark",
});

const errorNotify = () => toast.error('Algo fallo! por favor vuelve a intentar', {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  pauseOnHover: true,
  theme: "dark",
});

export default function EditProfileModal({ user }: { user: UserData }) {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone ?? ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(data: object) {
    setIsSaving(true);
    try {
      if (selectedFile) {
        const uploadRes = await userProfileService.uploadProfilePicture(selectedFile);
        if (!uploadRes.ok) {
          errorNotify();
          return;
        }
      }

      const res = await userProfileService.updateUserInfo(data);

      if (res.ok) {
        successNotify();
        setSelectedFile(null);
        setOpenModal(false);
      } else {
        errorNotify();
      }
    } finally {
      setIsSaving(false);
    }
  }

  const inputCls = `
    border 
    border-neutral-600 
    bg-background
    text-foreground
    rounded 
    px-3 
    py-2 
    md:py-1 
    mb-3 
    md:mb-4 
    w-full 
    md:w-auto 
    flex-1
    focus:outline-none
    focus:ring-2
    focus:ring-amber-600
  `;

  const handleInputChange = (formKey: string, value: string) => {
    setFormData({ ...formData, [formKey]: value });
  };

  return openModal ? (
    <div>
      {openModal && (
        <div
          className='
        fixed 
        w-full 
        h-full 
        bg-black/70 
        top-0 
        left-0 
        z-50
      '
        />
      )}

      <dialog
        open={openModal}
        className="
          fixed
          top-1/2
          left-1/2
          transform
          -translate-x-1/2
          -translate-y-1/2
          w-[90vw]
          md:w-[600px]
          max-w-[90vw]
          h-fit
          max-h-[90vh]
          overflow-y-auto
          z-50
          dark:bg-neutral-900
          dark:border
          border-neutral-700
          rounded-lg
          p-4
          md:p-6
          text-white
        "
      >
        <span
          className='
        absolute 
        right-3 
        top-3 
        md:right-5 
        md:top-5 
        select-none 
        cursor-pointer 
        text-lg 
        md:text-base 
        z-10 
        bg-neutral-800      
        hover:bg-neutral-700
        text-white
        rounded-full 
        w-6 
        h-6 
        flex 
        items-center 
        justify-center
      '
          onClick={() => setOpenModal(false)}
        >
          ×
        </span>

        <div className='flex flex-col w-full justify-between h-fit px-4 md:px-8 py-6 md:py-10'>
          <UpdateProfilePic onFileSelected={setSelectedFile} />

          <div className="flex flex-col mt-6 md:mt-10">
            <div className="flex flex-col md:flex-row gap-2 md:gap-0">
              <label htmlFor="firstName" className="md:mr-8 mb-1 md:mb-0 text-white">Nombre</label>
              <label htmlFor="lastName" className="text-white">Apellido</label>
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:gap-5 mt-2">
              <input
                className={inputCls}
                type="text"
                autoComplete="off"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
              <input
                className={inputCls}
                type="text"
                autoComplete="off"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="mb-1 text-white">Número de teléfono</label>
            <input
              className={inputCls}
              type="text"
              name="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>

          <button
            className="
              bg-primary
              rounded-lg 
              px-4 
              py-3 
              md:py-2 
              w-full 
              md:w-50 
              mt-6 
              md:mt-10 
              flex 
              items-center 
              justify-center 
              space-x-2
              md:mx-0
              mx-auto
              hover:bg-primary/90
              transition-colors
              disabled:opacity-50
              disabled:cursor-not-allowed
              text-primary-foreground
            "
            onClick={() => onSubmit(formData)}
            disabled={isSaving}
          >

            {isSaving ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
                  </path>
                </svg>
                <span>Subiendo...</span>
              </>
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </dialog>
      <ToastContainer />
    </div>
  ) : (
    <div
      className="
      absolute 
      z-10 
      cursor-pointer 
      bg-amber-50 
      rounded-full 
      outline-2 
      outline-primary 
      hover:bg-accent 
      transition-colors 
      text-sm 
      p-2 
      top-6 
      left-8 
      md:top-10 
      md:left-10 
      md:outline-3 
      md:p-1
      "
      onClick={() => setOpenModal(true)}
    >
      🖊
    </div>
  );
}
