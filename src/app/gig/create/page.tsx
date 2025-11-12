'use client';

import useCategory from '@/context/Category/useCategory';
import { useSession } from "next-auth/react";
import useUser from '@/context/User/useUser';
import clsx from 'clsx';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthMiddleware from "@/components/ClientAuthMiddleware";
import PoolSelect from '@/components/UI/PoolSelect';
import useTier from '@/context/Tier/index';
import Image from '@/components/UI/Image';
import TierForm from './components/TierForm';
import AddTier from './components/AddTier';
import { formContainerCls, tierListContainerCls, tierScrollListCls } from './styles';
import UploadGigImg from './components/UploadGigImg';
import gigService from '../gig.service';

interface User {
  id: string;
}

interface Tier {
  localId: number;
  name: string;
  price: number;
  description: string;
  deliveryTime: number;
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
  "rounded-lg",
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


export default function CreateGig() {
  const router = useRouter();

  const { status, data: session } = useSession();
  const { state: categoryState, actions: categoryActions } = useCategory({ skip: 0, limit: 10 });
  const { state: userState, actions: userActions } = useUser();
  const { state: tierState, actions: tierActions } = useTier();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [gigImgPreview, setGigImgPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const addTier = () => {
    const generatedId = Number.parseInt((Math.random() * 1000).toString());

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


  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: parseInt(formData.get("price") as string),
      categories: formData.get("categories") as string,
      tiers: tierState.tierList,
      userId: (userState?.userData as User)?.id,
    };

    const createGig = await fetch("/api/gig", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const newGig = await createGig.json();

    if (session?.userId && selectedFile && newGig.id) {
      const uploadGigImg = await gigService.uploadGigImg(selectedFile, session?.userId, newGig.id);

      if (uploadGigImg.ok) {
        router.push('/profile');
      }
    }

    if (newGig.id) {
      router.push('/profile');
    }

  }

  const labelCls = clsx(
    "mb-1",
    "text-l"
  );

  const tierComponents = tierState.tierList.map((t: Tier) => {
    return (
      <TierForm
        tier={t}
        onCloseHandler={() => tierActions.removeTier(t.localId!)}
        updateTierHandler={tierActions.updateTier}
        key={t.localId}
      />
    );
  });

  const searchResults = (
    search && categoryState.searchCategories.length && (
      <div
        className="
          absolute 
          top-19 
          left-0 
          w-full 
          rounded-lg 
          overflow-hidden 
          border 
          border-border 
          bg-card
        ">
        {categoryState.searchCategories.map((cat) => (
          <div
            className="
              w-full 
              bg-card 
              px-2 
              py-1 
              hover:bg-muted 
              text-card-foreground 
              transition-colors
            "
            key={cat.id}
            onClick={() => handleSearchCategory(cat)}
          >
            {cat.name}
          </div>
        ))}
      </div>
    )
  );

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


  useEffect(() => {
    userActions.fetchUserData();
  }, [session?.userId]);

  return (
    <AuthMiddleware status={status}>
      <div
        className="
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
        "
      >
        <div className={formContainerCls + " w-full lg:w-1/2 flex flex-col"}>
          <div className="flex flex-row relative align-sub mb-8">
            <Image
              src={gigImgPreview}
              alt="Upload new gig photo"
              className="w-20 h-20 rounded-full"
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
                bg-accent
                hover:bg-ring
                rounded-full
                cursor-pointer
              "
              modalClassName="max-w-lg"
              setPreview={setGigImgPreview}
              fileSetter={setSelectedFile}
            />
            <h1
              className="
                text-2xl 
                sm:text-3xl 
                font-bold 
                text-foreground 
                text-center 
                self-center 
                ml-5
              "
            >
              Crear un nuevo trabajo
            </h1>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-6 sm:gap-8 flex-1" action="POST">
            <div className="space-y-2">
              <label className={labelCls} htmlFor="title">
                Título del trabajo
              </label>
              <input
                type="text"
                name="title"
                autoComplete="off"
                className={inputCls}
                placeholder="Ej: Diseño de logo profesional"
              />
            </div>

            <div className="space-y-2">
              <label className={labelCls} htmlFor="description">
                Descripción
              </label>
              <textarea
                name="description"
                autoComplete="off"
                className={inputCls + " min-h-[100px] resize-none overflow-y-auto"}
                placeholder="Describe los detalles de tu servicio..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className={labelCls} htmlFor="price">
                Precio base (CLP)
              </label>
              <div className="relative">
                <span
                  className="
                    absolute 
                    left-4 
                    top-1/2 
                    transform 
                    -translate-y-1/2 
                    text-muted-foreground
                  "
                >
                  $
                </span>
                <input
                  type="number"
                  name="price"
                  autoComplete="off"
                  className={inputCls + " pl-10"}
                  placeholder="0"
                  min="0"
                  defaultValue={0}
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <label className={labelCls} htmlFor="categories">
                Categorías
              </label>
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
                  onChange={setSelectedIds}
                  selectedIds={selectedIds}
                />
              </div>

              <input type="hidden" name="categories" value={selectedIds.join(",")} />
            </div>

            <div className="hidden lg:flex mx-auto transform">
              <button
                className="
                  cursor-pointer 
                  rounded-full 
                  bg-primary 
                  hover:bg-primary/90 
                  text-primary-foreground 
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
                Crear Trabajo
              </button>
            </div>
          </form>
        </div>

        <div className={tierListContainerCls + " w-full lg:w-1/2"}>
          <div className="text-lg sm:text-xl mb-2 text-foreground">Niveles</div>
          <span className="text-xs sm:text-sm opacity-50 block mb-4 sm:mb-6 text-muted-foreground">
            Define los niveles en los que tus clientes pueden solicitar tus servicios
          </span>

          <div className={tierScrollListCls}>
            {tierList}
            {!!tierState.tierList.length && (
              <div onClick={() => addTier()} className="mt-4 flex justify-center">
                <Image
                  alt="add-tier-icon"
                  src="/plus_icon.svg"
                  className="w-8 sm:w-10 rounded-full cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        <div className="lg:hidden w-full mt-8">
          <button
            className="
            cursor-pointer 
            rounded-full 
            bg-primary 
            hover:bg-primary/90 
            text-primary-foreground 
            font-semibold 
            w-full 
            py-4 
            px-8 
            text-base 
            transition-colors 
            duration-200 
            shadow-lg 
            hover:shadow-xl
          "
            type="submit"
          >
            Crear Trabajo
          </button>
        </div>
      </div>

    </AuthMiddleware>

  );
}
