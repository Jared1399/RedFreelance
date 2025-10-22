import { queryBuilder } from "@/lib/utils";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const gigService = {
  fetchGigDetails: async (gigId: string, userId: string) => {
    const gigTierQuery = queryBuilder({
      gigId: gigId,
    });

    const fetchGigTiers = await fetch(`${BASE_URL}/api/gig/tier${gigTierQuery}`);
    const gigTiers = await fetchGigTiers.json();

    const fetchGigCreator = await fetch(`${BASE_URL}/api/user/id/${userId}`);
    const creator = await fetchGigCreator.json();


    return { gigTiers, creator };
  },
  fetchUserInfo: async (userId: string) => {
    const fetchUser = await fetch(`${BASE_URL}/api/user/id/${userId}`);
    const user = await fetchUser.json();
    return user;
  },
  async fetchUserByEmail(userEmail: string) {
    const fetchUserData = await fetch(`${BASE_URL}/api/user/email/${userEmail}`);
    const userData = await fetchUserData.json();

    delete userData["rankCommunity"];
    delete userData["rankPlatform"];

    return userData;
  },
};


export default gigService;