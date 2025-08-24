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

  }
};


export default gigService;