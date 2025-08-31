'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { GigTier } from '../../types/gig';
import { useSearchParams } from 'next/navigation';
import gigService from '../../gig.service';
import { User } from '../../types/User';
import clsx from 'clsx';
import { ToastContainer, toast } from 'react-toastify';



export default function RequestBtn({ gigTiers }: { gigTiers: GigTier[] }) {
  const notify = () => toast.success('Solicitud enviada!', {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    pauseOnHover: true,
    theme: "dark",
  });

  const searchParams = useSearchParams()!;
  const userId = searchParams.get("userId");
  const [user, setUser] = useState<User | null>(null);

  const [isDialogOpen, setDialogOpen] = useState(false);

  const [requestDetails, setRequestDetails] = useState("");
  const [selectedTier, setSelecterTier] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      requestDetails: formData.get("requestDetails"),
      tierId: formData.get("tierId")
    };
    console.info(payload);

    notify();
    setDialogOpen(false);

  }

  const tiers = gigTiers.map((tier: GigTier) => {

    const tierCls = clsx({
      "flex flex-row justify-between px-5 py-2 h-fit dark:bg-card rounded-lg border-2": true,
      "dark:border": tier.id != selectedTier,
      "border-amber-700": tier.id == selectedTier
    });

    return (
      <div
        key={tier.id}
        className={tierCls}
        onClick={() => {
          if (tier.id == selectedTier) {
            setSelecterTier("");
          } else {
            setSelecterTier("");
            setSelecterTier(tier.id);
          }
        }}
      >
        <div>{tier.name}</div>
        <div className='flex flex-col'>
          <div>CLP {tier.price}</div>
          <div>{tier.deliveryTime} dias</div>
        </div>
      </div>
    );
  });

  useEffect(() => {
    const fetchUser = async () => {
      const u = await gigService.fetchUserInfo(userId ?? "");
      setUser(u);
    };
    fetchUser();
  }, [userId]);



  return (
    <>
      {isDialogOpen && (
        <div className='
          fixed 
          w-[100%] 
          h-[100%] 
          bg-neutral-950 
          top-0 
          left-0 
          z-100 
          opacity-[0.8]
        '>
        </div>
      )}

      <dialog
        open={isDialogOpen}
        className='
          fixed 
          top-[25%] 
          left-[25%] 
          w-[50%] 
          h-fit 
          z-150 
          dark:bg-card 
          dark:border 
          rounded-lg
        '
      >
        <span
          className='absolute right-5 top-5'
          onClick={() => setDialogOpen(false)}
        >
          X
        </span>

        <div className='flex flex-row w-full justify-between mt-10 h-fit px-8'>

          <div className='w-[60%]'>
            <div className='mb-10'>
              <p>
                Comparte detalles, ideas y cualquier otra pregunta relacionada a tu solicitud
              </p>
              <p>
                Si {user?.firstName} aprueba tu propuesta se pondra en contacto contigo para
                continuar con el encargo
              </p>
            </div>
            <textarea
              className='dark:border rounded-lg w-full min-h-[120px] max-h-[300px] resize-y p-2'
              name="requestDetails"
              maxLength={2000}
              onChange={(e) => setRequestDetails(e.target.value)}
            >
            </textarea>
          </div>

          <div className='w-[35%] '>
            <div>
              <span>
                Selecciona el nivel para tu solicitud
              </span>
              <div
                className='
                  flex 
                  flex-col 
                  justify-start 
                  gap-2 
                  h-50 
                  bg-neutral-950 
                  py-2 
                  px-1 
                  mt-5 
                  rounded-2xl 
                  dark:outline
                '>
                {tiers}
              </div>
            </div>
          </div>

        </div>

        <form
          action="POST"
          className='place-self-end my-4 mr-8'
          onSubmit={onSubmit}
        >
          <input type="hidden" name='requestDetails' value={requestDetails} />
          <input type="hidden" name='tierId' value={selectedTier} />
          <button
            className='bg-amber-700 rounded-full w-fit px-8 py-2 self-center'
          >
            Enviar
          </button>
        </form>


      </dialog>

      <button
        className='bg-amber-700 rounded-full w-fit px-8 py-2 self-center'
        onClick={() => setDialogOpen(true)}
      >
        Solicitar
      </button>
      <ToastContainer />
    </>
  );
}
