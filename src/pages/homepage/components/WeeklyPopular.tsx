import SingleRowGrid from '@/components/UI/SingleRowGrid';
import GigCard from '@/components/UI/GigCard';
import { queryBuilder } from "@/lib/utils";


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

  const gigQuery = queryBuilder(
    {
      skip: 0,
      limit: 10
    }
  );

  const res = await fetch(`http://localhost:3000/api/gig${gigQuery}`);
  const data = await res.json();
  const gigList = data.gigs;

  return (
    <div className='text-white mb-8 mt-20 h-[300px]' >
      <h2 className='text-lg font-bold pl-6 mb-4'>Trabajos destacados de esta semana</h2>
      <SingleRowGrid childWidth={150}>
        {gigList.map((card: CardType, i: number) => {
          const trimTitle = card.title.length > 8 ?
            card.title.slice(0, 10).concat("...") :
            card.title;

          return (
            <GigCard
              key={i}
              title={trimTitle}
              price={card.price}
              userId={card.userId}
              userImg={card.user.userImg}
              userName={card.user.firstName}
              cardHeight={280}
              cardWidth={200}
            />
          );
        })
        }

      </SingleRowGrid>
    </div>
  );
}
