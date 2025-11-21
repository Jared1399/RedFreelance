import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/shadcn/tabs";
import { capitalizeFirst } from '@/lib/utils';
import RequestBtn from './RequestBtn';
import { Gig, GigTier } from '../../types/gig';


const GigTiers = ({ gigTiers, gig }: { gigTiers: GigTier[], gig: Gig }) => {

  const tierTabs = gigTiers.map((tier: GigTier, i: number) => {
    return (
      <TabsTrigger key={i} value={tier.name} className="text-xs sm:text-sm cursor-pointer">
        {tier.name}
      </TabsTrigger>
    );
  });

  const tierDetails = gigTiers.map((tier: GigTier, i: number) => {
    return (
      <TabsContent
        key={i}
        value={tier.name}
        className="w-full h-full bg-card rounded-lg py-4 sm:py-6 px-3 sm:px-4 flex flex-col mb-2"
      >
        <div
          className='
            flex 
            flex-row 
            justify-between 
            text-card-foreground
            items-center 
            h-8 
            sm:h-10 
            text-lg 
            sm:text-xl 
            md:text-2xl'
        >
          <div className="text-sm sm:text-base md:text-lg">{capitalizeFirst(tier.name)}</div>
          <div className="text-sm sm:text-base md:text-lg">CLP {tier.price.toLocaleString()}</div>
        </div>
        <div className='text-xs sm:text-sm mt-1 sm:mt-2'>
          Tiempo de entrega: {tier.deliveryTime ?? "0"} días
        </div>
        <div className='h-32 sm:h-40 py-2 text-sm sm:text-base leading-relaxed'>
          {tier.description}
        </div>


      </TabsContent>
    );
  });

  return (
    <div
      className="
        w-full 
        h-fit 
        py-4 
        sm:py-6 
        px-4 
        sm:px-6 
        lg:px-8 
        my-auto 
        bg-background 
        rounded-lg 
        border 
        border-border
      "
    >
      <Tabs defaultValue={gigTiers[0].name} className="h-full w-full">
        <TabsList className="w-full flex-wrap">
          {tierTabs}
        </TabsList>
        {tierDetails}
        <RequestBtn gigTiers={gigTiers} gig={gig} />

      </Tabs>
    </div>
  );
};

export default GigTiers;