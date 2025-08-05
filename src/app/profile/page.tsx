'use client';

import { useSession } from "next-auth/react";
import useUser from "@/context/User/useUser";
import AuthMiddleware from "@/components/AuthMiddleware";

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

  return (
    <AuthMiddleware status={status}>
      <>
        Hola denuevo, {userData?.firstName}!
      </>
    </AuthMiddleware>
  );
}