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

    delete userData["rankCommunity"];
    delete userData["rankPlatform"];

    return userData;
  },
  async getConversationByTransactionId(transactionId: string, limit?: string) {
    if (transactionId) {
      const conversationQuery = queryBuilder({ transactionId, limit: limit ?? null });
      const url = `${BASE_URL}/api/chat${conversationQuery}`;

      const fetchConversation = await fetch(url);
      const conversation = await fetchConversation.json();

      return conversation;
    }
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

    const conversation = await newConversation.json();
    return conversation;
  },
  async sendMessage(senderId: string, conversationId: string, text: string, metadata?: object) {
    const url = `${BASE_URL}/api/chat/message`;
    const data = { senderId, conversationId, text, metadata };

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const newMessage = await fetch(url, options);
    return newMessage;
  },
  async updateTransactionLifecycle(nextId: string, transactionId: string, deliveryTime?: number) {
    const lifecycle = await this.fetchLifecycleInfo(nextId);

    const data = { nextLifecycle: lifecycle.id, transactionId, deliveryTime };

    const updateTransactionUrl = `${BASE_URL}/api/user/transaction/update`;
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const updateTransaction = await fetch(updateTransactionUrl, options);

    const transaction = await updateTransaction.json();

    return transaction;
  },
  async newDelivery(transactionId: string) {
    const data = { newDelivery: true, transactionId };

    const newDeliveryUrl = `${BASE_URL}/api/user/transaction/update`;
    const options = {

      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const updateDelivery = await fetch(newDeliveryUrl, options);

    const transaction = await updateDelivery.json();

    return transaction;
  },
  async fetchLifecycleInfo(name: string) {
    const lifecycleQuery = queryBuilder({ name });
    const getLifecycleUrl = `${BASE_URL}/api/lifecycle${lifecycleQuery}`;

    const fetchLifecycleDetails = await fetch(getLifecycleUrl);

    const { lifecycle } = await fetchLifecycleDetails.json();

    return lifecycle;
  },
  async sendAttachment(
    file: File,
    userId: string,
    chatId: string,
    type: string,
    text?: string,
    transactionId?: string
  ) {

    const destination = `${chatId}/${userId}/${file.lastModified + file.name}`;
    const uploadQuery = queryBuilder({ userId, destination, type: file.type });

    const tokenRes = await fetch(`${BASE_URL}/api/upload/transaction${uploadQuery}`);
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

    await this.sendMessage(
      userId,
      chatId,
      text ?? file.name,
      { type: type, url: publicUrl }
    );

    if (transactionId && type == 'delivery') {
      this.newDelivery(transactionId);
    }

    return {
      ok: true,
      message: {
        text: text ?? file.name,
        metadata: { type: type, url: publicUrl }
      }
    };
  },

};


export default transactionService;