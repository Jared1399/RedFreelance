'use client';

import useCategory from '@/context/Category/useCategory';
import { useSession } from "next-auth/react";
import useUser from '@/context/User/useUser';
import clsx from 'clsx';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AuthMiddleware from "@/components/ClientAuthMiddleware";
import PoolSelect from '@/components/UI/PoolSelect';
import useTier from '@/context/Tier/index';
import Image from '@/components/UI/Image';
import TierForm from '../../create/components/TierForm';
import AddTier from '../../create/components/AddTier';
import { formContainerCls, tierListContainerCls, tierScrollListCls } from '../../create/styles';
import useGig from '@/context/Gig/useGig';
import { ToastContainer, toast } from 'react-toastify';
import UploadGigImg from '../../create/components/UploadGigImg';
import gigService from '../../gig.service';


const successNotify = (handleClick: () => void) => (
  toast.success(`Publicacion actualizada!\nHaz click aqui para volver a tu perfil`, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    pauseOnHover: true,
    theme: "dark",
    className: "cursor-pointer",
    onClick: () => handleClick()
  }));

const errorNotify = (msg: string) => toast.error(msg, {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  pauseOnHover: true,
  theme: "dark",
});


export interface GigParams {
  params: Promise<{ gigId: string }>;
}

interface GigInfo {
  id: string;
  title: string;
  description: string;
  price: number;
  categories: Category[];
  tiers?: Tier[];
  gigImg?: string;
}
interface Tier {
  id?: string;
  localId: number;
  name: string;
  price: number;
  description: string;
  deliveryTime: number;
  updatedAt: Date;
}

interface Category {
  id?: string;
  name: string;
  description: string;
  userId: string;
  created_at: Date;
  updated_at: Date;
}

const inputCls = clsx(
  "w-full",
  "px-4",
  "py-3",
  "border",
  "border-neutral-300",
  "dark:border-neutral-600",
  "rounded-lg",
  "bg-white",
  "dark:bg-neutral-800",
  "text-neutral-900",
  "dark:text-white",
  "focus:outline-none",
  "focus:border-amber-500",
  "focus:ring-2",
  "focus:ring-amber-200",
  "dark:focus:ring-amber-800",
  "transition-all",
  "duration-200",
  "placeholder-neutral-500",
  "dark:placeholder-neutral-400",
);

export default function EditGig() {
  const urlParams = useParams();
  const router = useRouter();

  const { status, data: session } = useSession();
  const { actions: gigActions } = useGig();
  const { state: categoryState, actions: categoryActions } = useCategory({ skip: 0, limit: 10 });
  const { actions: userActions } = useUser();
  const { state: tierState, actions: tierActions } = useTier();

  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [gigImgPreview, setGigImgPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const hasFetchedRef = useRef(false);

  const [gigInfo, setGigInfo] = useState<GigInfo>({
    id: '',
    title: '',
    description: '',
    price: 0,
    categories: [],
    tiers: [] as Tier[],
    gigImg: ''
  });

  const gigId = urlParams.gigId as string;

  useEffect(() => {
    if (!session?.userId || !gigId) return;
    if (hasFetchedRef.current) return;

    hasFetchedRef.current = true;

    gigActions.fetchGigById(gigId, session.userId).then((gigInfo) => {
      if (!gigInfo) return;
      setGigInfo({
        id: gigInfo.id,
        title: gigInfo.title ?? '',
        description: gigInfo.description ?? '',
        price: gigInfo.price ?? 0,
        categories: gigInfo.categories ?? [],
        gigImg: gigInfo.gigImg ?? null
      });

      setGigImgPreview(gigInfo.gigImg);

      if (gigInfo.GigTier?.length) {
        const sorted = gigInfo.GigTier
          .slice()
          .sort((a: Tier, b: Tier) => a.price - b.price);
        tierActions.setTiers(sorted.map((tier: Tier) => ({
          id: tier.id,
          localId: tier.id ?? Math.random(),
          name: tier.name,
          price: tier.price,
          description: tier.description || "",
          deliveryTime: tier.deliveryTime || 0,
        })));
      }

      if (gigInfo.categories?.length) {
        const ids = gigInfo.categories
          .map((cat: Category) => cat.id)
          .filter(Boolean);
        setSelectedCatIds(ids);
        gigInfo.categories.forEach(categoryActions.addCategory);
      }
    });
  }, [session?.userId, gigId]);


  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedCatIds.length) {
      errorNotify("Debes seleccionar al menos una categoria.");
      return;
    }

    try {
      const gigPayload = {
        gigId: gigId,
        userId: session?.userId,
        title: gigInfo.title,
        description: gigInfo.description,
        price: gigInfo.price,
        categories: selectedCatIds.join(","),
      };

      const gigRes = await fetch("/api/user/gig/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gigPayload),
      });

      if (!gigRes.ok) {
        const errorData = await gigRes.json();
        throw new Error(errorData.error || "Error updating gig");
      }

      const tierPromises = tierState.tierList.map(async (tier: Tier) => {
        const endpoint = tier.id ? "/api/gig/tier/update" : "/api/gig/tier";
        const payload = tier.id
          ? { tierId: tier.id, gigId, userId: session?.userId, ...tier }
          : { gigId, userId: session?.userId, ...tier };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`Tier ${tier.name} failed`);
        return res.json();
      });

      try {
        await Promise.all(tierPromises);
      } catch (error) {
        console.warn("Some tiers failed, but continuing...", error);
      }

      if (selectedFile && session?.userId) {
        await gigService.uploadGigImg(selectedFile, session.userId, gigInfo.id);
      }

      successNotify(() => router.push('/profile'));
    } catch (error) {
      console.error("Error updating gig:", error);
      alert("Error al actualizar: " + (error as Error).message);
    }
  }

  const labelCls = clsx(
    "mb-1",
    "text-l"
  );

  const handlePoolChange = (ids: number[]) => {
    setSelectedCatIds(ids);
  };
  const tierComponents = tierState.tierList.map((t: Tier) => {
    return (
      <TierForm
        tier={t}
        onCloseHandler={() => tierActions.removeTier(t.localId!)}
        updateTierHandler={tierActions.updateTier}
        key={t.id || t.localId}
      />
    );
  });

  const addTier = () => {
    const generatedId = Date.now() + Math.random();

    tierActions.addTier(
      {
        localId: generatedId,
        name: "",
        price: 0,
        description: "",
        deliveryTime: 0
      }
    );
  };

  const tierList = tierComponents.length ? tierComponents : <AddTier addTierHandler={addTier} />;

  const handleSearchCategory = (cat: Category) => {
    let repeated = false;
    categoryState.categoryList.map((c) => {
      if (c.name == cat.name) { repeated = true; }
    });

    if (!repeated) {
      categoryActions.addCategory(cat);
    }

    setSearch("");
  };

  const searchResults = (
    search && categoryState.searchCategories.length && (
      <div className='absolute top-19 left-0 w-full rounded-lg overflow-hidden'>
        {categoryState.searchCategories.map((cat) => (
          <div
            className="w-full bg-neutral-700 h-fit px-2 py-1 hover:bg-neutral-800"
            key={cat.id}
            onClick={() => handleSearchCategory(cat)}
          >
            {cat.name}
          </div>
        ))}
      </div>
    )
  );

  useEffect(() => {
    userActions.fetchUserData();
  }, [session?.userId]);

  return (
    <AuthMiddleware status={status}>
      <div
        className='
          flex
          flex-col
          lg:flex-row
          align-middle
          justify-center
          gap-6
          lg:gap-8
          mb-8
          lg:mb-15
          mx-2
        '>
        <div className={formContainerCls + " w-full lg:w-1/2 flex flex-col"}>
          <div className='flex flex-row relative align-sub mb-8'>
            <Image
              src={gigImgPreview}
              alt='Upload new gig photo'
              className='w-20 h-20 rounded-full'
            />
            <UploadGigImg
              icon="🖊"
              buttonText=""
              buttonClassName="
                absolute
                top-10
                left-13
                w-10
                h-10
                bg-amber-700
                hover:bg-amber-800
                rounded-full
              "
              modalClassName="max-w-lg"
              setPreview={setGigImgPreview}
              fileSetter={setSelectedFile}
            />
            <h1
              className='
              text-2xl 
              sm:text-3xl 
              font-bold 
              text-gray-900 
              dark:text-white 
              text-center 
              self-center
              ml-5
            '>

              Editar: {gigInfo.title}
            </h1>
          </div>

          <form onSubmit={onSubmit} className='flex flex-col gap-6 sm:gap-8 flex-1' action="POST">

            <div className="space-y-2">
              <label className={labelCls} htmlFor="title">Título del trabajo</label>
              <input
                type="text"
                name="title"
                autoComplete="off"
                className={inputCls}
                defaultValue={gigInfo.title}
                onChange={(e) => setGigInfo({ ...gigInfo, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className={labelCls} htmlFor="description">Descripción</label>
              <textarea
                name="description"
                autoComplete="off"
                className={inputCls + " min-h-[100px] resize-none overflow-y-auto"}
                defaultValue={gigInfo.description}
                onChange={(e) => setGigInfo({ ...gigInfo, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className={labelCls} htmlFor="price">Precio base (CLP)</label>
              <div className="relative">
                <span
                  className="
                    absolute 
                    left-4 
                    top-1/2 
                    transform 
                    -translate-y-1/2 
                    text-gray-500 
                    dark:text-gray-400
                  ">
                  $
                </span>
                <input
                  type="number"
                  name="price"
                  autoComplete="off"
                  className={inputCls + " pl-10"}
                  value={gigInfo.price}
                  onChange={(e) => setGigInfo({ ...gigInfo, price: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <label className={labelCls} htmlFor="categories">Categorías</label>
              <input
                type="text"
                name="searchCategories"
                autoComplete="off"
                className={inputCls}
                value={search}
                placeholder="Buscar categorías..."
                onChange={(e) => {
                  setSearch(e.target.value);
                  categoryActions.searchCategories(e.target.value);
                }}
              />

              {searchResults == 0 ? null : searchResults}

              <div className="mt-4">
                <PoolSelect
                  options={categoryState.categoryList}
                  onChange={handlePoolChange}
                  selectedIds={selectedCatIds}
                />
              </div>

              <input type="hidden" name="categories" value={selectedCatIds.join(",")} />
            </div>
            <div className="hidden lg:flex mx-auto transform">
              <button
                className="
                  cursor-pointer 
                  rounded-full 
                  bg-amber-600 
                  hover:bg-amber-700 
                  text-white 
                  font-semibold 
                  w-40 
                  py-3 
                  px-8 
                  text-base 
                  transition-colors 
                  duration-200 
                  shadow-lg 
                  hover:shadow-xl
                "
                type="submit"
              >
                Actualizar
              </button>
            </div>
          </form>
        </div>

        <div className={tierListContainerCls + " w-full lg:w-1/2"}>
          <div className='text-lg sm:text-xl mb-2'>Niveles</div>
          <span className='text-xs sm:text-sm opacity-[0.5] block mb-4 sm:mb-6'>
            Define los niveles en los que tus clientes pueden solicitar tus servicios
          </span>

          <div className={tierScrollListCls}>
            {tierList}
            {
              !!tierState.tierList.length && (
                <div onClick={() => addTier()} className='mt-4 flex justify-center'>
                  <Image
                    alt='add-tier-icon'
                    src='/plus_icon.svg'
                    className='w-8 sm:w-10 rounded-full cursor-pointer'
                  />
                </div>
              )
            }
          </div>
        </div>

        <div className="lg:hidden w-full mt-6">
          <button
            className="
                  cursor-pointer 
                  rounded-full 
                  bg-amber-600 
                  hover:bg-amber-700 
                  text-white 
                  font-semibold 
                  w-40 
                  py-3 
                  px-8 
                  text-base 
                  transition-colors 
                  duration-200 
                  shadow-lg 
                  hover:shadow-xl
                "
            type="submit"
          >
            Actualizar
          </button>
        </div>


      </div>

      <ToastContainer />
    </AuthMiddleware>

  );
}
