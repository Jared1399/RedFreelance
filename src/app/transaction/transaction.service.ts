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
  }
};


export default transactionService;