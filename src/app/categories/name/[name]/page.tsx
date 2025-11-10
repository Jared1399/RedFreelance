import Grid from '@/components/UI/Grid';
import Card from '@/components/UI/GigCard';
import { GigParams } from '../../types/Gig';
import categoryService from '../../category.service';
import { Gig } from "../../types/Gig";

export const dynamic = "force-dynamic";

export default async function CategoryName({ params }: GigParams) {
  const param = await params;
  const name = decodeURIComponent(param.name);

  const categoryInfo = await categoryService.fetchCategoryInfoByName(name);

  if (!categoryInfo) {
    return <div>Categoría no encontrada</div>;
  }

  const gigList = await categoryService.fetchGigsByCategoryId(categoryInfo.id);

  return (
    <div className='px-8'>
      Categoria: <strong>{name}</strong><br />
      <small>{categoryInfo.description}</small><br /><br />

      <Grid>
        {gigList.map((card: Gig, i: number) => (
          <Card
            key={i}
            title={card.title}
            price={card.price}
            userId={card.userId}
            userImg={card.user.userImg}
            userName={card.user.firstName}
            gigImg={card.gigImg}
          />
        ))}
      </Grid>
    </div>
  );
}
