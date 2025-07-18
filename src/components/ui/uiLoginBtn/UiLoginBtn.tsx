'use client';

import { useSession, signIn, signOut } from "next-auth/react"

const UiLoginBtn = () => {
  const { data: session, status } = useSession()

  console.log("Session:", session, "Status:", status)

  return session ? (
    <>
      Signed in as {session.user?.email} <br />
      <button onClick={() => signOut()}>Sign out</button>
    </>
  ) : (
    <button onClick={() => signIn('google', { callbackUrl: '/gigs' })}>Ingresar con Google</button>
  );
}

export default UiLoginBtn;