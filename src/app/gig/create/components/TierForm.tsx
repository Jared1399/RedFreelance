
import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface Tier {
  localId: number;
  name: string;
  price: number;
  description: string;
  deliveryTime: number;
}

const inputCls = clsx(
  "mb-4",
  "border",
  "rounded-sm",
  "bg-background",
  "text-foreground",
  "focus:outline-none",
  "focus:border-accent",
  "focus:ring-2",
  "focus:ring-accent/40",
  "transition-all",
  "duration-200",
  "placeholder-muted-foreground"
);
export default function TierForm(
  { tier, onCloseHandler, updateTierHandler }:
    { tier: Tier, onCloseHandler: () => void, updateTierHandler: (tier: Tier) => void }
) {

  const [tierInfo, updateTierInfo] = useState(tier);

  useEffect(() => {
    updateTierHandler(tierInfo);
  }, [tierInfo]);

  return (
    <div className="w-[95%] p-2 px-4 my-2 h-fit bg-card border-2 rounded-lg">
      <div className="flex flex-row justify-between w-full relative">
        <div
          className="
            absolute 
            right-0 
            top-0 
            cursor-pointer 
            text-muted-foreground 
            hover:text-foreground
          "
          onClick={() => onCloseHandler()}
        >
          x
        </div>

        <div className="mt-8 w-full flex justify-between items-center">
          <label htmlFor="tierName" className="text-foreground">
            Nombre
          </label>
          <input
            type="text"
            name="tierName"
            defaultValue={tier.name}
            onChange={(e) =>
              updateTierInfo({ ...tierInfo, name: e.target.value })
            }
            className={inputCls}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="w-full flex justify-between items-center">
        <label htmlFor="tierDescription" className="text-foreground">
          Descripción
        </label>
        <input
          type="text"
          name="tierDescription"
          defaultValue={tier.description}
          onChange={(e) =>
            updateTierInfo({ ...tierInfo, description: e.target.value })
          }
          className={inputCls}
          autoComplete="off"
        />
      </div>

      <div className="w-full flex justify-between items-center">
        <label htmlFor="tierPrice" className="text-foreground">
          Precio (CLP)
        </label>
        <input
          type="number"
          name="tierPrice"
          defaultValue={tier.price}
          onChange={(e) =>
            updateTierInfo({
              ...tierInfo,
              price: Number.parseInt(e.target.value),
            })
          }
          className={inputCls}
          autoComplete="off"
        />
      </div>

      <div className="w-full flex justify-between items-center">
        <label htmlFor="deliveryTime" className="text-foreground">
          Tiempo de entrega
        </label>
        <input
          type="number"
          name="deliveryTime"
          defaultValue={tier.deliveryTime}
          onChange={(e) =>
            updateTierInfo({
              ...tierInfo,
              deliveryTime: Number.parseInt(e.target.value),
            })
          }
          className={inputCls}
          autoComplete="off"
        />
      </div>
    </div>
  );
}