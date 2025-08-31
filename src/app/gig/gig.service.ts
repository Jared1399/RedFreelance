import { queryBuilder } from "@/lib/utils";

const gigService = {
  fetchGigDetails: async (gigId: string, userId: string) => {
    const gigTierQuery = queryBuilder({
      gigId: gigId,
    });

    const fetchGigTiers = await fetch(`http://localhost:3000/api/gig/tier${gigTierQuery}`);
    const gigTiers = await fetchGigTiers.json();

    const fetchGigCreator = await fetch(`http://localhost:3000/api/user/id/${userId}`);
    const creator = await fetchGigCreator.json();


    return { gigTiers, creator };
  },
  fetchUserInfo: async (userId: string) => {
    const fetchUser = await fetch(`http://localhost:3000/api/user/id/${userId}`);
    const user = await fetchUser.json();
    return user;
  }
};


export default gigService;