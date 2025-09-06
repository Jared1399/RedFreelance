import { queryBuilder } from "@/lib/utils";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const transactionService = {
  fetchTransactionInfo: async (transactionId: string) => {
    const transactionQuery = queryBuilder({ transactionId });
    const url = `${BASE_URL}/api/user/transaction/id${transactionQuery}`;

    const fetchTransaction = await fetch(url);
    const transaction = await fetchTransaction.json();

    return transaction;
  },
  async fetchUserTransactions(userId: string, limit?: number) {
    const userQuery = queryBuilder({ userId, limit: limit ?? 10 });
    const url = `${BASE_URL}/api/user/transaction${userQuery}`;

    const fetchUserTransactions = await fetch(url);
    const userTransactions = await fetchUserTransactions.json();

    return userTransactions;
  },
  async fetchUserById(userId: string) {
    const fetchUserData = await fetch(`${BASE_URL}/api/user/id/${userId}`);
    const userData = await fetchUserData.json();

    delete userData["passwordHash"];
    delete userData["rankCommunity"];
    delete userData["rankPlatform"];

    return userData;
  },
  async getConversationByTransactionId(transactionId: string, limit?: string) {
    const conversationQuery = queryBuilder({ transactionId, limit: limit ?? null });
    const url = `${BASE_URL}/api/chat${conversationQuery}`;

    const fetchConversation = await fetch(url);
    const conversation = await fetchConversation.json();

    return conversation;
  },
  async createConversation(clientId: string, freelancerId: string, transactionId: string) {
    const url = `${BASE_URL}/api/chat`;
    const data = { clientId, freelancerId, transactionId };
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const newConversation = await fetch(url, options);
    return newConversation;
  },
  async sendMessage(senderId: string, conversationId: string, text: string,) {
    const url = `${BASE_URL}/api/chat/message`;
    const data = { senderId, conversationId, text };

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const newMessage = await fetch(url, options);
    return newMessage;
  }
};


export default transactionService;