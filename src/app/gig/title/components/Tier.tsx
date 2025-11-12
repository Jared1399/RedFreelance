import clsx from 'clsx';
import { GigTier } from '../../types/gig';


interface LocalTier {
  id: string;
  price: number;
}

const Tier = (
  { tier, selectedTier, selectTierHandler }:
    {
      tier: GigTier,
      selectedTier: LocalTier,
      selectTierHandler: React.Dispatch<React.SetStateAction<LocalTier>>
    }) => {

  const tierCls = clsx({
    "flex flex-row justify-between px-5 py-2 h-fit bg-background rounded-lg border-2": true,
    "border": tier.id != selectedTier.id,
    "border-accent": tier.id == selectedTier.id
  });

  const selectTier = (tier: LocalTier) => {
    if (tier.id == selectedTier.id) {
      selectTierHandler({ id: "", price: 0 });
    } else {

      selectTierHandler({ id: tier.id, price: tier.price });
    }
  };

  return (
    <div
      key={tier.id}
      className={tierCls}
      onClick={() => selectTier(tier)}
    >
      <div>{tier.name}</div>
      <div className='flex flex-col'>
        <div>CLP {tier.price}</div>
        <div>{tier.deliveryTime} dias</div>
      </div>
    </div>
  );
};

export default Tier;