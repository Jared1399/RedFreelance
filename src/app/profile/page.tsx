
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
          <div className="bg-amber-800 w-[60%]">
            <UserDetails details={userData} />
          </div>
          <div className="bg-amber-900 w-[40%]">
            <UserTransactions transactionList={userTransactions} />
          </div>
        </div>
        <div className="bg-amber-700 w-full h-80">
          <UserGigs gigList={userGigs} />
        </div>
      </div>
    </AuthMiddleware>
  );
}