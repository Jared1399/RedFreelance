'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { GigTier } from '../../types/gig';
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

const errorNotify = () => toast.success('Solicitud enviada!', {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  pauseOnHover: true,
  theme: "dark",
});



export default function RequestBtn({ gigTiers, gigId }: { gigTiers: GigTier[], gigId: string }) {
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
      const u = await gigService.fetchUserInfo(freelancerId ?? "");
      setFreelancer(u);
    };
    fetchFreelancer();
  }, [freelancerId]);

  useEffect(() => {
    const fetchClient = async () => {
      const u = await gigService.fetchUserByEmail(clientMail ?? "");
      setClient(u);
    };
    fetchClient();
  }, [clientMail]);

  useEffect(() => {
    setCurrentGigId(gigId);
  }, [gigId]);

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
                Si {freelancer?.firstName} aprueba tu propuesta se pondra en contacto contigo para
                continuar con el encargo
              </p>
            </div>
            <textarea
              className='dark:border rounded-lg w-full min-h-[120px] max-h-[300px] resize-y p-2'
              name="requestDetails"
              maxLength={2000}
              onChange={(e) => setRequestDetails(e.target.value)}
              value={requestDetails}
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
          <input type="hidden" name='tierId' value={selectedTier.id} />
          <input type="hidden" name='tierPrice' value={selectedTier.price} />
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
