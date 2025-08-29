import { Gig } from "./types/Gig";
import { UserData } from "./types/User";
import { queryBuilder } from '@/lib/utils';

const userProfileService = {
  async fetchUser(userEmail: string) {
    const fetchUserData = await fetch(`http://localhost:3000/api/user/email/${userEmail}`);
    const userData: UserData = await fetchUserData.json();

    delete userData["passwordHash"];
    delete userData["rankCommunity"];
    delete userData["rankPlatform"];

    return userData;
  },
  async fetchUserGigs(userId: string) {
    const userQuery = queryBuilder({ userId });
    const fetchUserGigs = await fetch(`http://localhost:3000/api/user/gig/${userQuery}`);
    const userGigs: Gig[] = await fetchUserGigs.json();

    return userGigs;
  }
};



export default userProfileService;