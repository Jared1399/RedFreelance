import Image from '@/components/UI/Image';
import React from 'react';

export default function GetPremium() {
  return (
    <div className='text-white my-4 sm:my-6 lg:my-8 h-[250px] sm:h-[350px] lg:h-[460px] relative'>
      <Image
        src='https://images.unsplash.com/photo-1618709348403-ea30d1901362'
        className='w-full h-full brightness-[0.5] object-cover'
        alt='get-premium'
      />

      <div
        className='
          absolute 
          top-0 
          left-0 
          w-full 
          h-full 
          flex 
          flex-col 
          justify-center 
          items-center 
          px-4 
          text-center
        '>
        <h2 className='
          text-2xl
          sm:text-3xl
          md:text-4xl
          lg:text-5xl
          mb-3
          sm:mb-4
          lg:mb-5
          font-semibold
          [text-shadow:_0px_2px_4px_rgba(0,0,0,0.8)]
        '>
          Potencia tus habilidades
        </h2>
        <button className='
          bg-amber-800 
          hover:bg-amber-700
          font-medium 
          rounded-full 
          py-2 
          px-4
          sm:py-3
          sm:px-6
          lg:py-2
          lg:px-4
          text-sm
          sm:text-base
          lg:text-lg
          transition-colors
          duration-200
          [text-shadow:_0px_1px_2px_rgba(0,0,0,0.5)]
        '>
          Contrata premium
        </button>
      </div>
    </div>
  );
}