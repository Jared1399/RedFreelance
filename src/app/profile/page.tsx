
import { getServerSession } from "next-auth";
import AuthMiddleware from "@/components/ServerAuthProvider";
import userProfileService from "./userProfile.service";
import { Gig } from "./types/Gig";

export default async function ProfilePage() {
  const session = await getServerSession();
  const userName = session?.user?.name?.split(" ")[0];
  const userEmail = session?.user?.email;

  const userData = await userProfileService.fetchUser(userEmail ?? "");
  const userGigs = await userProfileService.fetchUserGigs((await userData).id);

  const gigList = userGigs.map((gig: Gig, i: number) => {
    return (
      <div key={i}>{gig.title}</div>
    );
  });

  return (
    <AuthMiddleware>
      <>
        Hola denuevo, {userName}!
      </>
      {gigList}
    </AuthMiddleware>
  );
}