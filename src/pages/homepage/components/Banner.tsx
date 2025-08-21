import React from 'react';
import Image from '@/components/UI/Image';

export default function Banner() {
  const bannerImgSrc = `
  https://images.unsplash.com/photo-1514395659518-2e1c59302e99`;

  return (
    <div className='text-zinc-700 bg-amber-200 my-8 h-[415px]'>
      <div className="w-full h-full relative">
        <Image
          src={bannerImgSrc}
          className="w-full h-[415px] brightness-[0.5]"
          alt='RedFreelance-image-banner'
        />
        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
          <h1 className='
          font-semibold
          text-amber-50
          text-5xl
          [text-shadow:_0px_2px_3px_rgba(0,0,0,0.8)]'
          >
            Bienvenido a RedFreelance <small>®</small>
          </h1>
        </div>
      </div>
    </div>
  );
}
