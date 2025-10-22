import { Gig } from "./types/Gig";
import { UserData } from "./types/User";
import { queryBuilder } from '@/lib/utils';


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const userProfileService = {
  async fetchUser(userEmail: string) {
    const fetchUserData = await fetch(`${BASE_URL}/api/user/email/${userEmail}`);
    const userData: UserData = await fetchUserData.json();

    delete userData["rankCommunity"];
    delete userData["rankPlatform"];

    return userData;
  },
  async fetchUserGigs(userId: string) {
    const userQuery = queryBuilder({ userId });
    const fetchUserGigs = await fetch(`${BASE_URL}/api/user/gig/${userQuery}`);
    const userGigs: Gig[] = await fetchUserGigs.json();

    return userGigs;
  },
  async fetchUserTransactions(userId: string) {
    const userQuery = queryBuilder({ userId });
    const url = `${BASE_URL}/api/user/transaction${userQuery}`;

    const fetchUserTransactions = await fetch(url);
    const userTransactions = await fetchUserTransactions.json();

    return userTransactions;
  },
  async fetchGigById(gigId: string) {
    const gigQuery = queryBuilder({ gigId });
    const fetchGigDetails = await fetch(`${BASE_URL}/api/gig/id${gigQuery}`);
    const gigDetails = await fetchGigDetails.json();

    return gigDetails;
  },
  async updateProfilePic(userId: string, imgUrl: string) {
    const data = { userId, userImg: imgUrl };
    const url = `${BASE_URL}/api/user/update`;

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const updatedUser = await fetch(url, options);

    const user = await updatedUser.json();

    return user;
  },
  async uploadProfilePicture(file: File, userId: string) {
    const pfpQuery = queryBuilder({ userId, destination: "profile.png" });
    const tokenRes = await fetch(`${BASE_URL}/api/upload/user${pfpQuery}`);
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

    const updated = await this.updateProfilePic(userId, publicUrl);
    return { ok: true, url: publicUrl, updated };

  },
  async updateUserInfo(newInfo: object, userId: string) {
    const data = { ...newInfo, userId };
    const url = `${BASE_URL}/api/user/update`;

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const updatedUser = await fetch(url, options);

    const user = await updatedUser.json();

    return user;
  }
};



export default userProfileService;