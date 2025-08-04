'use client';

import Grid from '@/components/UI/Grid';
import Card from '@/components/UI/GigCard';
import useGig from '@/context/Gig/useGig';

interface Card {
  title: string;
  price: number;
  description: string;
  userName: string;
  userImg: string;
  userId: string;
}

const Gig = () => {

  const { state } = useGig();

  const cardList = state.gigList ? state.gigList.map((card, i) => {
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
      <Grid>
        {cardList}
      </Grid>
    </>
  );
};

export default Gig;