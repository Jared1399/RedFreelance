import React from 'react';
import { Gig } from "../types/gig";
import { queryBuilder } from "@/lib/utils";
import Grid from '@/components/UI/Grid';
import Card from '@/components/UI/GigCard';


export const dynamic = "force-dynamic";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function SearchGig({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const title = resolvedParams?.title as string | undefined;
  const decodedTitle = title ?? "";

  const gigQuery = queryBuilder({
    title,
    user: true
  });

  const searchGigs = await fetch(`${BASE_URL}/api/gig/search${gigQuery}`, {
    cache: "no-store"
  });

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
        gigImg={gig.gigImg}
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
