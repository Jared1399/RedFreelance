'use client';

import Grid from '@/components/UI/Grid';
import Card from '@/components/UI/GigCard';
import useGig from '@/context/Gig/useGig';
import { use, useEffect } from 'react';


interface CardType {
  title: string
  price: number
  description: string
  userId: string
  user: {
    firstName: string
    userImg: string
  }
}

export default function CategoryName({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const decodedName = decodeURIComponent(name);

  const { state, actions } = useGig({ limit: 10, category: decodedName });

  useEffect(() => {
    actions.fetchGigsByCategory();
  }, []);


  return (
    <div>
      Categoria: <strong>{decodedName}</strong><br />
      <small>{state.categoryInfo.description}</small><br /><br />

      <Grid>
        {state.gigList?.map((card: CardType, i: number) => (
          <Card
            key={i}
            title={card.title}
            price={card.price}
            userId={card.userId}
            userImg={card.user.userImg}
            userName={card.user.firstName}
          />
        ))}
      </Grid>
    </div>
  );
}
