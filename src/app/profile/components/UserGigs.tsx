import React from 'react';
import { Gig } from '../types/Gig';
import Grid from '@/components/UI/Grid';
import Card from '@/components/UI/GigCard';
import { UserData } from '../types/User';

export default function UserGigs({ gigList, user }: { gigList: Gig[], user: UserData }) {
  const list = gigList.map((gig: Gig, i: number) => {
    return (
      <Card
        key={i}
        title={gig.title}
        price={Number.parseInt(gig.price)}
        userId={gig.userId}
        userImg={user.userImg}
        userName={"ti"}
        cardHeight={380}
        cardWidth={230}
      />
    );
  });

  return (
    <Grid>
      {list}
    </Grid>
  );
}
