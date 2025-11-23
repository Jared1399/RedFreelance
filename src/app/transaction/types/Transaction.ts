export interface TransactionInterface {
  id: string;
  freelancerId: string;
  clientId: string;
  gigId: string;
  lifecycleId: number;
  lifecycle: {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }
  tierId: string;
  amount: number;
  requestDetails: string;
  commission: number;
  commissionRate: number;
  paymentId: string;
  escrowStatus: string;
  completed: boolean;
  dueDate?: Date;
  expirationDate: Date;
  createdAt: Date;
  updatedAt: Date;
  description: {
    description: string;
    selectedTierId: string;
  }
  gig: {
    id: string;
    gigImg: string;
    title: string;
    description: string;
    price: number;
    status: string;
    created_at: Date;
    updated_at: Date;
    userId: string;
    likeCount: number;
  }
  tier: {
    id: string;
    name: string;
    price: number;
    description: string;
    deliveryTime: number;
    gigId: string;
  },
  disabledChat: boolean;
  requests: {
    id: string;
    transactionId: string;
    requesterId: string;
    type: string;
    status: string;
    details: JSON;
    requestMsg: string;
    createdAt: Date;
    updatedAt: Date;
  }
}


