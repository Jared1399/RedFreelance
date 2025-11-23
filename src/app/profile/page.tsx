
import { getServerSession } from "next-auth";
import AuthMiddleware from "@/components/ServerAuthProvider";
import userProfileService from "./userProfile.service";
import UserGigs from "./components/UserGigs";
import UserDetails from "./components/UserDetails";
import UserTransactions from "./components/UserTransactions";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession();
  const userEmail = session?.user?.email;

  const userData = await userProfileService.fetchUser(userEmail ?? "");
  const userGigs = await userProfileService.fetchUserGigs(userData.id);
  const userTransactions = await userProfileService.fetchUserTransactions(userData.id);

  return (
    <AuthMiddleware>
      <div>
        <div className="w-full flex flex-col lg:flex-row justify-between gap-6 lg:gap-8 mb-8">
          <div className="w-full lg:w-[60%]">
            <h2 className='text-lg font-bold pl-4 lg:pl-6 mb-4'>Detalles de tu perfil</h2>
            <UserDetails details={userData} />
          </div>

          <div className="w-full lg:w-[40%]">
            <h2 className='flex flex-row text-lg font-bold pl-4 lg:pl-6 mb-4 justify-between'>
              <Link href="/transaction">
                Tus transacciones
              </Link>
              <Link href="/transaction" className="text-accent font-normal mr-6">
                Ver todo
              </Link>
            </h2>
            <UserTransactions transactionList={userTransactions} />

          </div>
        </div>

        <div className="w-full lg:w-[95%] mx-auto">
          <UserGigs gigList={userGigs} user={userData} />
        </div>
      </div>
    </AuthMiddleware>
  );
}