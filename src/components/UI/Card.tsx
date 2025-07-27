import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/shadcn/card";

interface UiCardProps {
  cardTitle: string,
  cardDescription: string,
  cardAction: number,
  cardContent: string,
  cardFooter: string
}

const UiCard: React.FC<UiCardProps> = ({
  cardTitle,
  cardDescription,
  cardAction,
  cardContent,
  cardFooter
}) => {
  return (
    <Card>
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
    </Card>
  );
};

export default UiCard;