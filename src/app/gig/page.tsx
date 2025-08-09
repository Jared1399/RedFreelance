'use client';

import Grid from '@/components/UI/Grid';
import Card from '@/components/UI/GigCard';
import useGig from '@/context/Gig/useGig';
import { useEffect } from 'react';


const Gig = () => {

  const { state, actions } = useGig({ limit: 10 });

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

  useEffect(() => {
    actions.fetchGigList();
  }, []);

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