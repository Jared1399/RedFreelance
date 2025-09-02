import { queryBuilder } from "@/lib/utils";

const transactionService = {
  fetchTransactionInfo: async (transactionId: string) => {
    const transactionQuery = queryBuilder({ transactionId });
    const url = `http://localhost:3000/api/user/transaction/id${transactionQuery}`;

    const fetchTransaction = await fetch(url);
    const transaction = await fetchTransaction.json();

    return transaction;
  },
  async fetchUserTransactions(userId: string, limit?: number) {
    const userQuery = queryBuilder({ userId, limit: limit ?? 10 });
    const url = `http://localhost:3000/api/user/transaction${userQuery}`;

    const fetchUserTransactions = await fetch(url);
    const userTransactions = await fetchUserTransactions.json();

    return userTransactions;
  },
  async fetchUserById(userId: string) {
    const fetchUserData = await fetch(`http://localhost:3000/api/user/id/${userId}`);
    const userData = await fetchUserData.json();

    delete userData["passwordHash"];
    delete userData["rankCommunity"];
    delete userData["rankPlatform"];

    return userData;
  },
  async getConversationByTransactionId(transactionId: string, limit?: string) {
    const conversationQuery = queryBuilder({ transactionId, limit: limit ?? null });
    const url = `http://localhost:3000/api/chat${conversationQuery}`;

    const fetchConversation = await fetch(url);
    const conversation = await fetchConversation.json();

    return conversation;
  },
  async createConversation(clientId: string, freelancerId: string, transactionId: string) {
    const url = 'http://localhost:3000/api/chat';
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
    const url = 'http://localhost:3000/api/chat/message';
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