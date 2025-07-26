'use client';

import { useSession } from "next-auth/react";
import useUser from "@/context/User/useUser";

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userImg: string;
  identification: string;
  isFreelancer: boolean;
  isVerified: boolean;
  level: number;
  phone: string;
  subscriptionPlan: string;
  warningCount: number;
  createdAt: Date;
  updatedAt: Date;
  subscriptionEnd: Date;
  subscriptionStart: Date;
};

export default function ProfilePage() {
  const { status } = useSession();
  const { state } = useUser();

  const userData = state.userData as UserData | null;

  if (status === "loading" || !state) {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  return (
    <>
      Hola denuevo, {userData?.firstName}!
    </>
  );
}