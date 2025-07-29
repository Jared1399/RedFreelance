import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/shadcn/card";
import Link from "next/link";
import { queryBuilder } from "@/lib/utils";


interface UiCardProps {
  cardTitle: string,
  cardDescription: string,
  cardAction: number,
  cardContent: string,
  cardFooter: string,
  userId: string
}

const UiCard: React.FC<UiCardProps> = ({
  cardTitle,
  cardDescription,
  cardAction,
  cardContent,
  cardFooter,
  userId
}) => {

  const gigQuery = queryBuilder({
    title: cardTitle,
    userId: userId
  });

  return (
    <Card>
      <Link href={`/gig/title${gigQuery}`}>

        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
          <CardAction>{cardAction}</CardAction>
        </CardHeader>
        <CardContent>
          <p>{cardContent}</p>
        </CardContent>
        <CardFooter>
          <p>{cardFooter}</p>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default UiCard;