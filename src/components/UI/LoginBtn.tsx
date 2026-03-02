'use client';

import { useSession, signIn, signOut } from "next-auth/react";

const UiLoginBtn = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  return session ? (
    <div className="w-full">
      <div className="text-xs text-gray-500 mb-2 px-2">
        Conectado como
      </div>
      <div className="text-sm font-medium truncate mb-3 px-2">
        {session.user?.email}
      </div>
      <button
        onClick={() => signOut()}
        className="
          w-full 
          text-left 
          px-3 
          py-2 
          text-sm 
          hover:bg-gray-100 
          rounded-md 
          transition-colors
        "
      >
        Cerrar sesión
      </button>
    </div>
  ) : (
    <button
      onClick={() => signIn('google')}
      className="
        w-full 
        text-left 
        px-3 
        py-2 
        text-sm 
        hover:bg-gray-100 
        rounded-md 
        transition-colors
        cursor-pointer
      ">
      Ingresar con Google
    </button>
  );
};

export default UiLoginBtn;