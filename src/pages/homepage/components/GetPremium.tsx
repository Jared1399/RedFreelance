import Image from '@/components/UI/Image';
import React from 'react';

export default function GetPremium() {
  return (
    <div className='text-white bg-blue-900 my-8 h-[460px] relative' >
      <Image
        src='https://images.unsplash.com/photo-1618709348403-ea30d1901362'
        className='w-full h-[460px] brightness-[0.5]'
        alt='get-premium' />

      <div
        className='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center'
      >
        <h2 className='text-5xl mb-5 font-semibold'>Potencia tus habilidades</h2>
        <button className='bg-amber-800 font-medium rounded-full py-2 px-4'>
          Contrata premium
        </button>
      </div>

    </div>
  );
}
