export interface GigParams {
  params: Promise<{ name: string }>;
}

export type Gig = {
  title: string
  price: number
  description: string
  userId: string
  user: {
    firstName: string
    userImg: string
  }
};
