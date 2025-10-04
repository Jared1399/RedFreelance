export interface MessageInterface {
  id: string;
  text: string;
  createdAt: Date;
  senderId: string;
  metadata?: Metadata
  conversationId: string;
  sender: string;
}

export interface Metadata {
  read?: boolean;
  type?: string;
  url?: string
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


export type LocalMsg = { id?: string; text: string; sender: "me" | "other"; metadata?: Metadata };