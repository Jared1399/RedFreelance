export interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  gigImg: string;
  status: string;
  userId: string;
  created_at: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    identification: string;
    userImg: string;
    isVerified: string;
    createdAt: string;
    updatedAt: string;
    subscriptionPlan: string;
    level: string;
  }
}


export interface GigSearchParamsProps {
  params: Promise<{
    title: string;
    userId: string;
  }>;
}

export interface GigTier {
  name: string;
  description: string;
  price: number;
  gigId: string;
  id: string;
  deliveryTime: string;
}
