import { queryBuilder } from "@/lib/utils";
import { authFetch } from "@/lib/authFetch";



const transactionService = {
  fetchTransactionInfo: async (transactionId: string) => {
    const transactionQuery = queryBuilder({ transactionId });
    const url = `/api/user/transaction/id${transactionQuery}`;

    const fetchTransaction = await authFetch(url);
    const transaction = await fetchTransaction.json();

    return transaction;
  },
  async fetchUserTransactions(userId: string, limit?: number) {
    const userQuery = queryBuilder({ userId, limit: limit ?? 10 });
    const url = `/api/user/transaction${userQuery}`;

    const fetchUserTransactions = await authFetch(url);
    const userTransactions = await fetchUserTransactions.json();

    return userTransactions;
  },
  async fetchUserById(userId: string) {
    const fetchUserData = await authFetch(`/api/user/id/${userId}`);
    const userData = await fetchUserData.json();

    delete userData["rankCommunity"];
    delete userData["rankPlatform"];

    return userData;
  },
  async getConversationByTransactionId(transactionId: string, limit?: string) {
    if (transactionId) {
      const conversationQuery = queryBuilder({ transactionId, limit: limit ?? null });
      const url = `/api/chat${conversationQuery}`;

      const fetchConversation = await authFetch(url);
      const conversation = await fetchConversation.json();

      return conversation;
    }
  },
  async createConversation(clientId: string, freelancerId: string, transactionId: string) {
    const url = `/api/chat`;
    const data = { clientId, freelancerId, transactionId };
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const newConversation = await authFetch(url, options);

    const conversation = await newConversation.json();
    return conversation;
  },
  async sendMessage(senderId: string, conversationId: string, text: string, metadata?: object) {
    const url = `/api/chat/message`;
    const data = { senderId, conversationId, text, metadata };

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const newMessage = await authFetch(url, options);
    return newMessage;
  },
  async updateTransactionLifecycle(nextId: string, transactionId: string, deliveryTime?: number) {
    const lifecycle = await this.fetchLifecycleInfo(nextId);

    const completed = nextId == 'completed';

    const data = { nextLifecycle: lifecycle.id, transactionId, deliveryTime, completed };

    const updateTransactionUrl = `/api/user/transaction/update`;
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const updateTransaction = await authFetch(updateTransactionUrl, options);

    const transaction = await updateTransaction.json();

    return transaction;
  },
  async newDelivery(transactionId: string) {
    const data = { newDelivery: true, transactionId };

    const newDeliveryUrl = `/api/user/transaction/update`;
    const options = {

      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const updateDelivery = await authFetch(newDeliveryUrl, options);

    const transaction = await updateDelivery.json();

    return transaction;
  },
  async fetchLifecycleInfo(name: string) {
    const lifecycleQuery = queryBuilder({ name });
    const getLifecycleUrl = `/api/lifecycle${lifecycleQuery}`;

    const fetchLifecycleDetails = await authFetch(getLifecycleUrl);

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

    const tokenRes = await authFetch(`/api/upload/transaction${uploadQuery}`);
    const tokenData = await tokenRes.json();

    const { uploadUrl, key } = tokenData;
    if (!uploadUrl || !key) {
      throw new Error('Missing uploadUrl or key');
    }

    const uploadRes = await authFetch(uploadUrl, {
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
  async extendTransactionDate(
    transactionId: string,
    daysToExtend: number
  ) {
    const updateTransactionUrl = `/api/user/transaction/update`;

    const data = {
      transactionId,
      deliveryTime: daysToExtend,
      newDelivery: false,
      completed: false
    };

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const updateTransaction = await authFetch(updateTransactionUrl, options);

    return updateTransaction;
  },
  async createTransactionRequest(
    daysToExtend: number, transactionId: string, userId: string, reqStatus?: string
  ) {
    const createRequestUrl = `/api/transaction/request`;

    const data = {
      daysToExtend,
      transactionId,
      userId,
      requestType: "TIME_EXTENSION",
      requestStatus: reqStatus ?? 'PENDING'
    };

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      }
    };

    const newTransactionRequest = await authFetch(createRequestUrl, options);

    return newTransactionRequest;
  },
  async updateTransactionRequest(requestId: string, newState: string) {
    const updateRequestUrl = `/api/transaction/request/update`;

    const data = {
      requestId,
      newState
    };
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      }
    };

    const updatedTransactionRequest = await authFetch(updateRequestUrl, options);

    return updatedTransactionRequest;
  }

};


export default transactionService;