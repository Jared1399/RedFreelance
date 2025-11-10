'use client';
import React from 'react';
import { Gig } from '../types/Gig';
import Grid from '@/components/UI/Grid';
import Card from '@/components/UI/GigCard';
import { UserData } from '../types/User';
import { useSession } from "next-auth/react";


export default function UserGigs({ gigList, user }: { gigList: Gig[], user: UserData }) {
  const { status, data: session } = useSession();

  const canEditGig = (userId: string) => status == 'authenticated' && session.userId == userId;

  const list = gigList.map((gig: Gig, i: number) => {
    return (
      <Card
        key={i}
        title={gig.title}
        price={Number.parseInt(gig.price)}
        userId={gig.userId}
        userImg={user.userImg}
        userName={user.firstName}
        editable={canEditGig(gig.userId)}
        gigId={gig.id}
        size="md"
        gigImg={gig.gigImg}
      />
    );
  });

  return (
    <div className='mx-4 sm:mx-6 lg:mx-8 my-6 sm:my-8 lg:my-10'>
      <h2 className='text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white'>
        Tus publicaciones
      </h2>
      <Grid className="gap-4 sm:gap-6 lg:gap-8">
        {list}
      </Grid>
    </div>
  );
}
