export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userImg: string;
  identification: string;
  isFreelancer: boolean;
  isVerified: boolean;
  level: string;
  phone: string;
  subscriptionPlan: string;
  warningCount: number;
  createdAt: Date;
  updatedAt: Date;
  subscriptionEnd: Date;
  subscriptionStart: Date;
  followers: string[];
  following: string[];
  passwordHash?: string;
  rankCommunity?: number;
  rankPlatform?: number;
};

export interface UserTransaction {
  id: string;
  freelancerId: string;
  clientId: string;
  gigId: string;
  lifecycleId: number;
  amount: number;
  commission: number;
  commissionRate: number;
  paymentId: string;
  lifecycle: {
    id: number;
    name: string;
    description: string;
  }
  escrowStatus: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}