import SingleRowGrid from '@/components/UI/SingleRowGrid';
import GigCard from '@/components/UI/GigCard';
import { queryBuilder } from "@/lib/utils";

export const dynamic = "force-dynamic";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface CardType {
  title: string
  price: number
  description: string
  userId: string
  user: {
    firstName: string
    userImg: string
  }
}

export default async function WeeklyPopular() {
  const gigQuery = queryBuilder({
    skip: 0,
    limit: 10
  });

  const res = await fetch(`${BASE_URL}/api/gig${gigQuery}`, { cache: "no-store" });
  const data = await res.json();
  const gigList = data.gigs;

  return (
    <div className='
      text-white 
      mb-6 
      sm:mb-8 
      lg:mb-12 
      mt-12 
      sm:mt-16 
      lg:mt-20 
      h-auto 
      min-h-[280px]
      sm:min-h-[320px]
    '>
      <h2 className='
        text-lg 
        sm:text-xl 
        lg:text-2xl 
        font-bold 
        pl-4 
        sm:pl-6 
        mb-4 
        sm:mb-6
        text-center 
        sm:text-left
      '>
        Trabajos destacados de esta semana
      </h2>
      <SingleRowGrid>
        {gigList.map((card: CardType, i: number) => {
          return (
            <div key={i} className="h-full">
              <GigCard
                title={card.title}
                price={card.price}
                userId={card.userId}
                userImg={card.user.userImg}
                userName={card.user.firstName}
                size="md"
                href={card.title}
              />
            </div>
          );
        })}
      </SingleRowGrid>
    </div>
  );
}