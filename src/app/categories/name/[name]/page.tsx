interface Props {
  params: { name: string };
}

interface Gig {
  title: string;
  description: string;
  price: number;
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

      <div>
        {gigList.map((gig: Gig, i: number) => {
          return (
            <div key={i}>
              {gig.title} <br />
              {gig.description} <br />
              {gig.price}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryName;
