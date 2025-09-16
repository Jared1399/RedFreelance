"use client";

import clsx from 'clsx';
import React, { useState } from 'react';
import useGigSearch from './hooks/useGigSearch';
import { useRouter } from 'next/navigation';
import { Gig } from './hooks/useGigSearch/reducer';
import { queryBuilder } from '@/lib/utils';


const inputCls = clsx(
  "w-fit",
  "border",
  "border-solid",
  "border-white",
  "rounded",
  "px-2",
  "py-1",
  "relative"
);

export default function SearchBar() {
  const { state, actions } = useGigSearch();
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  const router = useRouter();

  const handleSearchGig = (gig: Gig) => {
    const href = queryBuilder({
      title: gig.title,
      userId: gig.userId
    });
    router.push(`/gig/title${href}`);
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = queryBuilder({ title: search });

      if (search === "") {
        router.push(`/gig/search`);
      } else {
        router.push(`/gig/search${query}`);
      }

      router.refresh();

      setSearch("");
    }
  };

  const searchResults = (
    <div className='absolute top-9 left-0 min-w-1 rounded-b-lg'>
      {search && showResults && state.searchGigs.map((gig) => (
        <div
          className="w-full bg-neutral-700 h-fit px-2 py-1 hover:bg-neutral-800 cursor-pointer"
          key={gig.id}
          onClick={() => handleSearchGig(gig)}
        >
          {gig.title}
        </div>
      ))}
    </div>);

  return (
    <>
      <input
        type="text"
        autoComplete="off"
        value={search}
        name="search"
        className={inputCls}
        onChange={(e) => {
          setSearch(e.target.value);
          actions.searchGigs(e.target.value);
        }}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        onFocus={() => setShowResults(true)}
        onKeyDown={(e) => handleEnterKeyPress(e)}

      />
      {searchResults}
    </>
  );
}
