'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { Gig, GigTier } from '../../types/gig';
import { useSearchParams } from 'next/navigation';
import gigService from '../../gig.service';
import { User } from '../../types/User';
import { ToastContainer, toast } from 'react-toastify';
import { useSession } from "next-auth/react";
import Tier from './Tier';

const successNotify = () => toast.success('Solicitud enviada!', {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  pauseOnHover: true,
  theme: "dark",
});

const errorNotify = () => toast.error('Algo fallo! por favor vuelve a intentar', {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  pauseOnHover: true,
  theme: "dark",
});

export default function RequestBtn({ gigTiers, gig }: { gigTiers: GigTier[], gig: Gig }) {
  const searchParams = useSearchParams()!;
  const { data } = useSession();

  const clientMail = data?.user?.email;
  const freelancerId = searchParams.get("userId");

  const [freelancer, setFreelancer] = useState<User | null>(null);
  const [client, setClient] = useState<User | null>(null);
  const [currentGigId, setCurrentGigId] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [requestDetails, setRequestDetails] = useState("");
  const [selectedTier, setSelectedTier] = useState({
    id: "",
    price: 0,
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      tierId: formData.get("tierId"),
      freelancerId: freelancer?.id,
      clientId: client?.id,
      gigId: currentGigId,
      requestDetails: formData.get("requestDetails"),
      amount: selectedTier.price,
      baseConditions: {
        selectedTierId: selectedTier.id,
        description: gig.description
      }
    };

    const res = await fetch("/api/user/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setRequestDetails("");
      setSelectedTier({ id: "", price: 0 });
      setDialogOpen(false);
      successNotify();
    } else {
      errorNotify();
    }
  }

  const tiers = gigTiers.map((tier: GigTier, i: number) => {
    return (
      <Tier
        key={i}
        tier={tier}
        selectedTier={selectedTier}
        selectTierHandler={setSelectedTier}
      />
    );
  });

  useEffect(() => {
    const fetchFreelancer = async () => {
      if (freelancerId) {
        const u = await gigService.fetchUserInfo(freelancerId);
        setFreelancer(u);
      }
    };
    fetchFreelancer();
  }, [freelancerId]);

  useEffect(() => {
    const fetchClient = async () => {
      if (clientMail) {
        const u = await gigService.fetchUserByEmail(clientMail ?? "");
        setClient(u);
      }
    };
    fetchClient();
  }, [clientMail]);

  useEffect(() => {
    setCurrentGigId(gig.id);
  }, [gig.id]);

  if (!data) return;
  if (data.userId == freelancerId) return;

  return (
    <>
      {isDialogOpen && (
        <div className='
      fixed 
      w-full 
      h-full 
      bg-neutral-950 
      top-0 
      left-0 
      z-50 
      opacity-90
      sm:opacity-80
    '>
        </div>
      )}

      <dialog
        open={isDialogOpen}
        className='
          fixed 
          top-4 left-4 right-4 bottom-4
          sm:top-10 sm:left-10 sm:right-10 sm:bottom-10
          md:top-15 md:left-20 md:right-20 md:bottom-15
          lg:top-20 lg:left-32 lg:right-32 lg:bottom-20
          xl:top-24 xl:left-40 xl:right-40 xl:bottom-24
          w-[calc(100%-2rem)] h-[calc(100%-2rem)]
          sm:w-[calc(100%-5rem)] sm:h-[calc(100%-5rem)]
          md:w-[calc(100%-10rem)] md:h-[calc(100%-7.5rem)]
          lg:w-[calc(100%-16rem)] lg:h-[calc(100%-10rem)]
          xl:w-[calc(100%-20rem)] xl:h-[calc(100%-12rem)]
          z-50 
          bg-background
          border
          rounded-lg
          p-4
          sm:p-6
          overflow-y-auto
        '
      >
        <button
          className='
            absolute 
            top-3 right-3
            sm:top-4 sm:right-4
            md:top-5 md:right-5
            w-6 h-6
            sm:w-7 sm:h-7
            md:w-8 md:h-8
            flex items-center 
            justify-center
            rounded-full
            text-sm
            sm:text-base
            transition-colors
            bg-muted
            hover:bg-muted-foreground
            cursor-pointer
            z-10
          '
          onClick={() => setDialogOpen(false)}
          type="button"
        >
          ✕
        </button>

        <div className='
          flex 
          flex-col
          md:flex-row 
          w-full
          h-[80%]
          pt-0
          md:pt-5
          justify-between 
          gap-2.5 
          sm:gap-6
          md:gap-8
        '>

          <div className='
            w-full
            md:w-[70%]
            lg:w-[75%]
            flex flex-col
          '>
            <div className='mb-4 sm:mb-6'>
              <p className='
            text-sm sm:text-base
            mb-2 sm:mb-3
            leading-relaxed
          '>
                Comparte detalles, ideas y cualquier otra pregunta relacionada a tu solicitud
              </p>
              <p className='
            text-sm sm:text-base
            text-foreground
            leading-relaxed
          '>
                Si {freelancer?.firstName} aprueba tu propuesta se pondrá en contacto contigo para
                continuar con el encargo
              </p>
            </div>

            <textarea
              className='
            dark:border 
            rounded-lg 
            w-full 
            flex-1
            min-h-[150px] 
            sm:max-h-[150px]
            md:max-h-[70%]
            xl:min
            resize-y 
            p-3
            sm:p-4
            text-sm
            sm:text-base
            bg-muted
            border-2
            focus:outline-none
            transition-colors
          '
              name="requestDetails"
              maxLength={2000}
              onChange={(e) => setRequestDetails(e.target.value)}
              value={requestDetails}
              placeholder="Describe tu solicitud aquí..."
            />
          </div>

          <div className='
        w-full
        md:w-[28%]
        lg:w-[23%]
        overflow-y-auto
        flex flex-col
      '>
            <span className='
              text-sm sm:text-base
              font-medium
              block mb-2  
              sm:mb-4
            '>
              Selecciona el nivel
            </span>
            <div
              className='
                flex 
                flex-col 
                justify-start 
                gap-2
                max-h-[200px]  
                sm:max-h-[400px]
                overflow-y-auto
                py-2       
                px-2       
                sm:py-3
                sm:px-3
                rounded-lg  
                sm:rounded-xl
                bg-muted
                border-2
              '>
              {tiers}
            </div>
          </div>

        </div>

        <form
          className='
        w-full
        mt-3 
        sm:mt-6
        flex
        justify-end
      '
          onSubmit={onSubmit}
        >
          <div className='
        flex
        flex-col
        sm:flex-row
        items-center
        gap-2   
        sm:gap-3
        w-full
        sm:w-auto
      '>
            <input type="hidden" name='requestDetails' value={requestDetails} />
            <input type="hidden" name='tierId' value={selectedTier.id} />
            <input type="hidden" name='tierPrice' value={selectedTier.price} />

            <button
              type="button"
              className='
            w-full
            sm:w-auto
            px-4
            py-2
            border
            border-gray-600
            rounded-full
            text-sm
            hover:bg-gray-800
            transition-colors
            sm:hidden
          '
              onClick={() => setDialogOpen(false)}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className='
            bg-accent
            hover:bg-ring
            rounded-full
            w-full
            sm:w-auto
            px-6
            py-2   
            sm:py-3
            text-sm
            sm:text-base
            font-medium
            transition-colors
            disabled:opacity-50
            disabled:cursor-not-allowed
          '
              disabled={!selectedTier.id || !requestDetails.trim()}
            >
              Enviar Solicitud
            </button>
          </div>
        </form>

      </dialog>

      <button
        className='
          cursor-pointer
          text-white
          bg-accent
          hover:bg-ring
          rounded-full
          w-full
          sm:w-auto
          px-6
          sm:px-8
          py-3
          text-sm
          sm:text-base
          font-medium
          transition-colors
        '
        onClick={() => setDialogOpen(true)}
      >
        Solicitar
      </button>

      <ToastContainer />
    </>
  );
}