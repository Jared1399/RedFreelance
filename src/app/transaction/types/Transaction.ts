export interface TransactionInterface {
  id: string;
  freelancerId: string;
  clientId: string;
  gigId: string;
  lifecycleId: number;
  tierId: string;
  amount: number;
  requestDetails: string;
  commission: number;
  commissionRate: number;
  paymentId: string;
  escrowStatus: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  }

}


