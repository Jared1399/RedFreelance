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
        const uploadRes = await userProfileService.uploadProfilePicture(selectedFile, user.id);
        if (!uploadRes.ok) {
          errorNotify();
          return;
        }
      }

      const res = await userProfileService.updateUserInfo(data, user.id);

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

  const handleInputChange = (formKey: string, value: string) => {
    setFormData({ ...formData, [formKey]: value });
  };

  return openModal ? (
    <div>
      {openModal && (
        <div className='
          fixed 
          w-[100%] 
          h-[100%] 
          bg-neutral-950 
          top-0 
          left-0 
          z-100 
          opacity-[0.8]
        '>
        </div>
      )}

      <dialog
        open={openModal}
        className='
          fixed 
          top-[25%] 
          mx-auto
          w-fit  
          h-fit 
          z-150 
          dark:bg-card 
          dark:border 
          rounded-lg
        '
      >
        <span
          className='absolute right-5 top-5 select-none cursor-pointer'
          onClick={() => setOpenModal(false)}
        >
          X
        </span>

        <div className='flex flex-col w-fit justify-between h-fit px-8 py-10'>
          <UpdateProfilePic onFileSelected={setSelectedFile} />

          <div className="flex flex-col mt-10">
            <div className="flex flex-row">
              <label htmlFor="firstName" className="mr-35">Nombre</label>
              <label htmlFor="lastName">Apellido</label>
            </div>
            <div className="flex flex-row">
              <input
                className="border border-solid border-white rounded mb-4 mr-5"
                type="text"
                autoComplete="off"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
              <input
                className="border border-solid border-white rounded mb-4"
                type="text"
                autoComplete="off"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone">Numero de telefono</label>
            <input
              className="border border-solid border-white rounded mb-4 w-45"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>

          <button
            className="
              bg-amber-700 
              rounded-lg 
              px-4 
              py-2 
              w-50 
              mt-10 
              flex 
              items-center 
              justify-center 
              space-x-2
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
        text-sm 
        top-10 
        left-10 
        bg-amber-50 
        rounded-full 
        p-1 
        outline-3 
        outline-[var(--card)] 
        cursor-pointer
      "
      onClick={() => setOpenModal(true)}
    >
      🖊
    </div>
  );
}
