
import { getServerSession } from "next-auth";
import AuthMiddleware from "@/components/ServerAuthProvider";
import userProfileService from "./userProfile.service";
import UserGigs from "./components/UserGigs";
import UserDetails from "./components/UserDetails";
import UserTransactions from "./components/UserTransactions";

export default async function ProfilePage() {
  const session = await getServerSession();
  const userEmail = session?.user?.email;

  const userData = await userProfileService.fetchUser(userEmail ?? "");
  const userGigs = await userProfileService.fetchUserGigs(userData.id);
  const userTransactions = await userProfileService.fetchUserTransactions(userData.id);

  return (
    <AuthMiddleware>
      <div>
        <div className="w-full flex flex-row justify-between h-80">
          <div className="w-[60%]">
            <h2 className='text-lg font-bold pl-6'>Detalles de tu perfil</h2>
            <UserDetails details={userData} />
          </div>
          <div className="w-[40%]">
            <h2 className='text-lg font-bold pl-6'>Tus transacciones</h2>
            <UserTransactions transactionList={userTransactions} />
          </div>
        </div>
        <div className="w-[95%] h-130 mx-auto">
          <h2 className='text-lg font-bold pl-6 mb-4'>Tus publicaciones</h2>
          <UserGigs gigList={userGigs} user={userData} />
        </div>
      </div>
    </AuthMiddleware>
  );
}