'use client';

import React, { useEffect } from 'react';
import SingleRowGrid from '@/components/UI/SingleRowGrid';
import GigCard from '@/components/UI/GigCard';
import useGig from '@/context/Gig/useGig';

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

export default function WeeklyPopular() {
  const { state, actions } = useGig({ limit: 5 });

  useEffect(() => {
    actions.fetchGigList();
  }, []);

  return (
    <div className='text-white my-8 h-[300px]' >
      <SingleRowGrid childWidth={150}>
        {state.gigList?.map((card: CardType, i: number) => {
          const trimTitle = card.title.length > 8 ?
            card.title.slice(0, 10).concat("...") :
            card.title;

          return (
            <GigCard
              key={i}
              title={trimTitle}
              price={card.price}
              userId={card.userId}
              userImg={card.user.userImg}
              userName={card.user.firstName}
              cardHeight={280}
              cardWidth={200}
            />
          );
        })
        }

      </SingleRowGrid>
    </div>
  );
}
