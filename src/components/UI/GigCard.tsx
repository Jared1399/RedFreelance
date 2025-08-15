import Link from "next/link";
import { queryBuilder } from "@/lib/utils";
import Image from "@/components/UI/Image";
import clsx from 'clsx';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/shadcn/avatar";

interface GigCardProps {
  title: string;
  price: number;
  userName: string;
  userImg: string;
  userId: string;
  cardWidth?: number;
  cardHeigth?: number
}

const GigCard: React.FC<GigCardProps> = ({
  title,
  price,
  userId,
  userName,
  userImg,
  cardWidth,
  cardHeigth
}) => {

  const cardContainerCls = clsx(
    "flex",
    "flex-col",
    `${cardWidth ? `w-[${cardWidth}px]` : 'w-auto'}`,
    `h-[${cardHeigth ?? 400}px]`,
    "mx-auto",
    "rounded-lg",
    "dark:bg-card",
    "dark:border",
    "px-2 ",
    "py-2",
    "shadow-[0px_4px_6px_0px_rgba(81,_81,_81,_0.5)]"
  );

  const gigQuery = queryBuilder({
    title: title,
    userId: userId
  });

  const userInfo = (!cardWidth || (cardWidth > 200)) ? (
    <>
      <Avatar className="h-auto w-5 mr-1">
        <AvatarImage src={userImg ?? "/not_found.png"} />
        <AvatarFallback>RF</AvatarFallback>
      </Avatar>
      Creado por
      <span className="ml-1">
        <strong>{userName}</strong>
      </span></>
  ) : null;

  return (
    <Link href={`/gig/title${gigQuery}`}>
      <div className={cardContainerCls}>
        <div className="w-full">
          <Image
            className={
              `rounded-lg w-full h-[${cardHeigth ? cardHeigth / 1.5 : 240}px] drop-shadow-color`
            }
            alt="gig-card-image"
          />
        </div>
        <div className="my-auto ml-2">
          <div className="flex flex-row align-baseline text-xs mb-3">
            {
              userInfo
            }
          </div>
          <div>
            <h3 className="text-2xl">{title}</h3>
            <p>Desde CLP {price}</p>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default GigCard;