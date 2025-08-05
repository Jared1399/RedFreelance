import Grid from '@/components/UI/Grid';
import Card from '@/components/UI/GigCard';

interface Props {
  params: { name: string };
}

interface Card {
  title: string;
  price: number;
  description: string;
  userId: string;
  user: {
    firstName: string;
    userImg: string;
  }
}


const CategoryName = async ({ params }: Props) => {
  const param = await params;
  const decodedName = decodeURIComponent(param.name);

  const fetchCategory = await fetch(`http://localhost:3000/api/category/name/${decodedName}`);
  const categoryInfo = await fetchCategory.json();

  const fetchGigs = await fetch(`http://localhost:3000/api/gig/category/${categoryInfo.id}`);
  const gigList = await fetchGigs.json();

  return (
    <div>
      Categoria: <strong>{decodedName}</strong><br />
      <small>{categoryInfo?.description}</small><br /><br />

      <Grid>
        {gigList.map((card: Card, i: number) => {
          return (
            <Card
              key={i}
              title={card.title}
              price={card.price}
              userId={card.userId}
              userImg={card.user.userImg}
              userName={card.user.firstName}
            />
          );
        })}
      </Grid>
    </div>
  );
};

export default CategoryName;
