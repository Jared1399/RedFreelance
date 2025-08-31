import React from 'react';
import { Gig, GigSearchParamsProps } from "../types/gig";
import { queryBuilder } from "@/lib/utils";
import Grid from '@/components/UI/Grid';
import Card from '@/components/UI/GigCard';

export default async function Searchgig({ searchParams }: GigSearchParamsProps) {

  const { title } = await searchParams;

  const decodedTitle = title ?? "";

  const gigQuery = queryBuilder({
    title,
    user: true
  });

  const searchGigs = await fetch(`http://localhost:3000/api/gig/search${gigQuery}`);

  const res = await searchGigs.json();

  const gigList = res.map((gig: Gig, i: number) => {
    return (
      <Card
        key={i}
        title={gig.title}
        price={gig.price}
        userId={gig.userId}
        userImg={gig.user?.userImg ?? ""}
        userName={gig.user?.firstName ?? ""}
      />
    );
  });

  return (
    <div>
      <div className='mt-10 mx-10'>
        <h2 className='text-lg font-bold pl-6'>{`Resultados de la busqueda "${decodedTitle}"`}</h2>
        <div className='flex items-center align-middle mx-10 my-5'>
          <Grid>
            {gigList}
          </Grid>
        </div>
      </div>
    </div>
  );
}
