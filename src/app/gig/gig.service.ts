import { queryBuilder } from "@/lib/utils";
import { authFetch } from "@/lib/authFetch";


const gigService = {
  fetchGigDetails: async (gigId: string, userId: string) => {
    const gigTierQuery = queryBuilder({
      gigId: gigId,
    });

    const fetchGigTiers = await authFetch(`/api/gig/tier${gigTierQuery}`);
    const gigTiers = await fetchGigTiers.json();

    const fetchGigCreator = await authFetch(`/api/user/id/${userId}`);
    const creator = await fetchGigCreator.json();


    return { gigTiers, creator };
  },
  fetchUserInfo: async (userId: string) => {
    const fetchUser = await authFetch(`/api/user/id/${userId}`);
    const user = await fetchUser.json();
    return user;
  },
  async fetchUserByEmail(userEmail: string) {
    const fetchUserData = await authFetch(`/api/user/email/${userEmail}`);
    const userData = await fetchUserData.json();

    delete userData["rankCommunity"];
    delete userData["rankPlatform"];

    return userData;
  },
  async uploadGigImg(file: File, userId: string, gigId: string) {
    const gigImgQuery = queryBuilder({ userId, destination: "gigImg.png", gigId });
    const tokenRes = await authFetch(`/api/upload/gig${gigImgQuery}`);
    const tokenData = await tokenRes.json();

    const { uploadUrl, key } = tokenData;
    if (!uploadUrl || !key) {
      throw new Error('Missing uploadUrl or key');
    }

    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (!uploadRes.ok) {
      const text = await uploadRes.text().catch(() => '');
      throw new Error(`Upload failed: ${uploadRes.status} ${text}`);
    }

    const publicUrl = `https://pub-dfd719a7c85b4b75aaeebef2fb7c8e21.r2.dev/redfreelance/${key}`;

    const updated = await this.updateGigImg(userId, gigId, publicUrl);
    return { ok: true, url: publicUrl, updated };

  },
  async updateGigImg(userId: string, gigId: string, imgUrl: string) {
    const data = { userId, gigImg: imgUrl, gigId };
    const url = `/api/user/gig/update`;

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const updatedGig = await authFetch(url, options);

    const gig = await updatedGig.json();

    return gig;
  }
};


export default gigService;