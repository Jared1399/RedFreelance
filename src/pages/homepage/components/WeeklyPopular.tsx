import React from 'react';
import SingleRowGrid from '@/components/UI/SingleRowGrid';
import GigCard from '@/components/UI/GigCard';


export default function WeeklyPopular() {
  return (
    <div className='text-white bg-blue-500 my-8 h-[300px]' >
      <SingleRowGrid childWidth={150}>
        <GigCard
          title={'title'}
          price={1000}
          userId={'342314asfd'}
          userImg={'img'}
          userName={'tu vieja'}
          cardHeigth={50}
          cardWidth={100}
        />

        <GigCard
          title={'title'}
          price={1000}
          userId={'342314asfd'}
          userImg={'img'}
          userName={'tu vieja'}
          cardHeigth={100}
          cardWidth={100}
        />
      </SingleRowGrid>
    </div>
  );
}
