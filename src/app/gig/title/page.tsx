import { queryBuilder } from "@/lib/utils";

interface Gig {
  title: string;
  description: string;
  price: number;
  gigImg: string;
  status: string;
  created_at: string;
  userId: string;
}

interface SearchParamsProps {
  searchParams: {
    title?: string;
    userId?: string;
  };
}

const GigName = async ({ searchParams }: SearchParamsProps) => {
  const { title, userId } = await searchParams;

  const decodedTitle = title ?? "";

  const gigQuery = queryBuilder({
    title: title,
    userId: userId
  });

  const fetchGig = await fetch(`http://localhost:3000/api/gig/title${gigQuery}`);
  const gigInfo: Gig = await fetchGig.json();

  const fetchGigCreator = await fetch(`http://localhost:3000/api/user/id/${gigInfo.userId}`);
  const creator = await fetchGigCreator.json();


  return (
    <div>
      <div>Creado por: {creator?.firstName} {creator?.isVerified ? "✅" : null}</div>
      <br /><br />
      <strong>{decodedTitle}</strong><br />
      {gigInfo?.description}<br /><br />
      CLP {gigInfo?.price}<br /><br />
      <small>{gigInfo?.created_at}</small><br /><br />
      <div>

      </div>
    </div>
  );
};

export default GigName;
