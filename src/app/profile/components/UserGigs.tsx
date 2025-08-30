import React from 'react';
import { Gig } from '../types/Gig';

export default function UserGigs({ gigList }: { gigList: Gig[] }) {
  const list = gigList.map((gig: Gig, i: number) => {
    return (
      <div key={i}>{gig.title}</div>
    );
  });

  return (
    <div>{list}</div>
  );
}
