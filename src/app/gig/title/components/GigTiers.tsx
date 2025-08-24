import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/shadcn/tabs";
import { capitalizeFirst } from '@/lib/utils';

interface GigTier {
  name: string;
  description: string;
  price: number;
  gigId: string;
  id: string;
  deliveryTime: string;
}

const GigTiers = ({ gigTiers }: { gigTiers: GigTier[] }) => {

  const tierTabs = gigTiers.map((tier: GigTier, i: number) => {
    return <TabsTrigger key={i} value={tier.name}>{tier.name}</TabsTrigger>;
  });

  const tierDetails = gigTiers.map((tier: GigTier, i: number) => {
    return (
      <TabsContent
        key={i}
        value={tier.name}
        className="w-full h-full bg-neutral-700 rounded-lg py-6 px-4 flex flex-col"
      >
        <div className='flex flex-row justify-between items-center h-10 text-2xl'>
          <div>{capitalizeFirst(tier.name)}</div>
          <div>CLP {tier.price}</div>
        </div>
        <div className='text-sm'>Tiempo de entrega: {tier.deliveryTime ?? "0"} dias</div>
        <div className='h-40 py-2'>
          {tier.description}
        </div>

        <button className='bg-amber-700 rounded-full w-fit px-8 py-2 self-center'>Solicitar</button>

      </TabsContent>
    );
  });

  return (
    <div className="w-full h-fit py-6 px-8 my-auto bg-neutral-800 outline-4 rounded-lg">
      <Tabs defaultValue={gigTiers[0].name} className="h-full w-full" >

        <TabsList>
          {tierTabs}
        </TabsList>

        {tierDetails}

      </Tabs>
    </div>
  );
};

export default GigTiers;