'use client';

import Grid from '@/components/UI/Grid';
import Card from '@/components/UI/Card';
import useGig from '@/context/Gig/useGig';

interface Card {
  title: string;
  status: string;
  price: number;
  description: string
  userId: string
}

const Gig = () => {

  const { state } = useGig();

  const cardList = state.gigList ? state.gigList.map((card, i) => {
    return (
      <Card
        key={i}
        cardTitle={card.title}
        cardDescription={card.status}
        cardAction={card.price}
        cardContent={card.description}
        cardFooter='cardFooter'
        userId={card.userId ?? ""}
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