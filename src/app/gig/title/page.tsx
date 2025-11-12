import Image from "@/components/UI/Image";
import GigTiers from "./components/GigTiers";
import formatDateES from "@/lib/timeago";
import { capitalizeFirst, queryBuilder } from "@/lib/utils";
import Link from "next/link";
import gigService from "../gig.service";
import { Gig } from "../types/gig";


export const dynamic = "force-dynamic";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


const GigName = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {

  const resolvedParams = await searchParams;

  const title = resolvedParams?.title as string | undefined;
  const userId = resolvedParams?.userId as string | undefined;

  const decodedTitle = title ?? "";

  const gigQuery = queryBuilder({
    title: title,
    userId: userId
  });


  const fetchGig = await fetch(`${BASE_URL}/api/gig/title${gigQuery}`, {
    cache: "no-store"
  });

  const gigInfo: Gig = await fetchGig.json();

  const { gigTiers, creator } = await gigService.fetchGigDetails(gigInfo.id, gigInfo.userId);

  return (
    <div>
      <div className="relative">
        <Image
          alt="gig-image"
          className="w-full h-40 sm:h-50 md:h-60 lg:h-70 opacity-[0.5] object-cover blur-sm"
          src={gigInfo.gigImg ?? ''}
        />

        <div
          className="
            absolute 
            top-4 
            sm:top-20 
            md:top-8 
            left-4 
            sm:left-6 
            md:left-10 
            right-4 
            sm:right-6 
            md:right-10 
            flex 
            flex-row 
            items-start 
            gap-3 
            sm:gap-4 
            md:gap-6 
            pt-8 
          ">
          <Link href={creator.id} className="flex-shrink-0 mt-1">
            <Image
              alt="profile-pic"
              className="
                w-12 h-12
                sm:w-16 sm:h-16
                md:w-20 md:h-20
                lg:w-24 lg:h-24
                xl:w-30 xl:h-30
                rounded-full
                sm:outline-3
                md:outline-4
                lg:outline-5
                xl:outline-6
                outline-accent
                outline-2
                outline-offset-1
                sm:outline-offset-2
                md:outline-offset-3
                lg:outline-offset-4
              "
              src={gigInfo.gigImg ?? ''}
            />
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex flex-row items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <Link href={creator.id}>
                <span
                  className="
                    text-sm 
                    sm:text-base 
                    md:text-lg 
                    lg:text-xl 
                    font-semibold 
                    whitespace-nowrap
                  ">
                  {creator.firstName} {creator.isVerified ? " ✅" : null}
                </span>
              </Link>
              <span
                className="
                  text-xs 
                  sm:text-sm 
                  md:text-base 
                  text-muted-foreground 
                  whitespace-nowrap
                ">
                {creator.level}
              </span>
            </div>

            <h1
              className="
                text-lg 
                sm:text-2xl 
                md:text-3xl 
                lg:text-4xl 
                xl:text-5xl 
                font-bold 
                leading-tight 
                break-words  
              ">
              {capitalizeFirst(decodedTitle)}
            </h1>

            <small className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
              {formatDateES(gigInfo?.created_at)}
            </small>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-auto my-4 sm:my-6 lg:my-8 gap-6 lg:gap-8">
        <div
          className="
            w-full 
            lg:w-[60%] 
            py-6 
            sm:py-10 
            lg:py-14 
            px-4 
            sm:px-6 
            lg:px-8 
            h-full 
            flex 
            flex-col 
            justify-start 
            items-start
          ">
          <h2 className="mb-4 text-lg sm:text-xl lg:text-2xl font-bold">Acerca de este trabajo</h2>
          <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
            {gigInfo?.description}
          </p>
        </div>

        <div className="w-full lg:w-[40%] h-full flex justify-center items-center p-4 sm:p-6">
          <GigTiers gigTiers={gigTiers} gig={gigInfo} />
        </div>
      </div>
    </div>
  );
};

export default GigName;
