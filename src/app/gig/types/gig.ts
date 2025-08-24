export interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  gigImg: string;
  status: string;
  userId: string;
  created_at: string;
}


export interface GigSearchParamsProps {
  searchParams: {
    title?: string;
    userId?: string;
  };
}