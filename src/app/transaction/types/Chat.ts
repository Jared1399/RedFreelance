export interface MessageInterface {
  id: string;
  text: string;
  createdAt: Date;
  senderId: string;
  metadata: {
    read: boolean;
  };
  conversationId: string;
  sender: string;
}

export interface ConversationInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  transactionId: string;
  participants: [
    {
      id: string;
      userId: string;
      conversationId: string;
      joinedAt: Date;
    }
  ],
  messages: MessageInterface[];
}