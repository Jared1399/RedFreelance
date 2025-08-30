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
  },
  async fetchUserTransactions(userId: string) {
    const userQuery = queryBuilder({ userId });
    const url = `http://localhost:3000/api/user/transaction${userQuery}`;

    const fetchUserTransactions = await fetch(url);
    const userTransactions = await fetchUserTransactions.json();

    return userTransactions;
  },
  async fetchGigById(gigId: string) {
    const gigQuery = queryBuilder({ gigId });
    const fetchGigDetails = await fetch(`http://localhost:3000/api/gig/id${gigQuery}`);
    const gigDetails = await fetchGigDetails.json();

    return gigDetails;
  }
};



export default userProfileService;