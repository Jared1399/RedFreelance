import Image from "@/components/UI/Image";
import GigTiers from "./components/GigTiers";
import formatDateES from "@/lib/timeago";
import { capitalizeFirst, queryBuilder } from "@/lib/utils";
import Link from "next/link";
import gigService from "../gig.service";
import { Gig, GigSearchParamsProps } from "../types/gig";


export const dynamic = "force-dynamic";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


const GigName = async ({ searchParams }: GigSearchParamsProps) => {

  const { title, userId } = searchParams;

  const decodedTitle = title ?? "";

  const gigQuery = queryBuilder({
    title: title,
    userId: userId
  });


  const fetchGig = await fetch(`${BASE_URL}/api/gig/title${gigQuery}`, {
    cache: "no-store"
  });

  const gigInfo: Gig = await fetchGig.json();

  if (!gigInfo || !gigInfo.id) {
    return <div>No se encontró el gig solicitado o la respuesta es inválida.</div>;
  }

  const { gigTiers, creator } = await gigService.fetchGigDetails(gigInfo.id, gigInfo.userId);

  return (
    <div>
      <div className="relative">
        <Image alt="gig-image" className="w-full h-70 opacity-[0.5]" />

        <div className="absolute top-15 left-10 flex flex-row ">
          <Link href={creator.id}>
            <Image
              alt="profile-pic"
              className="
              w-30
              h-30
              mr-4
              mt-4
              rounded-full
              outline-6
              outline-amber-50
              outline-offset-4
             "
            />
          </Link>

          <div className="flex flex-col ml-4">
            <Link href={creator.id}>
              <span className="text-xl">
                {creator.firstName} {creator.isVerified ? " ✅" : null}
              </span>
            </Link>
            <span className="text-lg">{creator.level}</span>
            <p className="text-6xl">
              {capitalizeFirst(decodedTitle)}
            </p>
            <small className="mt-4">{formatDateES(gigInfo?.created_at)}</small>
          </div>
        </div>
      </div>

      <div className="flex flex-row h-100 my-8">

        <div className="w-[60%] py-14 px-8 h-full flex flex-col justify-start items-start">
          <h2 className="mb-4 text-xl font-bold">Acerca de este trabajo</h2>
          <p >
            {gigInfo?.description}
          </p>
        </div>

        <div className="w-[40%] h-full flex justify-center items-center p-4">
          <GigTiers gigTiers={gigTiers} gigId={gigInfo.id} />
        </div>
      </div>

    </div>
  );
};

export default GigName;
