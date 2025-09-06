import Grid from '@/components/UI/Grid';
import Card from '@/components/UI/GigCard';
import { queryBuilder } from "@/lib/utils";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface GigCardProps {
  title: string;
  price: number;
  userName: string;
  userImg: string;
  userId: string;
  user: {
    userImg: string,
    firstName: string
  }
}

const Gig = async () => {
  const gigQuery = queryBuilder(
    {
      skip: 0,
      limit: 10
    }
  );

  const res = await fetch(`${BASE_URL}/api/gig${gigQuery}`);
  const data = await res.json();

  const gigList = data.gigs;
  const cardList = gigList ? gigList.map((card: GigCardProps, i: number) => {
    return (
      <Card
        key={i}
        title={card.title}
        price={card.price}
        userId={card.userId}
        userImg={card.user.userImg}
        userName={card.user.firstName}
      />
    );
  }) : null;


  return (
    <>
      <h1 className='text-3xl pb-8'>Encuentra el servicio que mas te guste</h1>
      <Grid>
        {cardList}
      </Grid>
    </>
  );
};

export default Gig;