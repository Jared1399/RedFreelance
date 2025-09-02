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
  cardHeight?: number;
  href?: string
}

const GigCard: React.FC<GigCardProps> = ({
  title,
  price,
  userId,
  userName,
  userImg,
  cardWidth,
  cardHeight,
  href
}) => {

  const cardContainerCls = clsx(
    "flex",
    "flex-col",
    "w-auto",
    "mx-auto",
    "rounded-lg",
    "dark:bg-card",
    "dark:border",
    "px-2 ",
    "py-2",
    "shadow-[0px_4px_6px_0px_rgba(81,_81,_81,_0.5)]"
  );

  const gigQuery = queryBuilder({
    title: href ?? title,
    userId: userId
  });

  const imageHeight = cardHeight ? (cardHeight / 1.5).toString().split(".")[0] : 240;

  const userInfo = (!cardWidth || (cardWidth > 200)) ? (
    <>
      <div className="flex flex-row align-center text-xs mt-4 ml-2">
        <Avatar className="h-auto w-5 mr-1">
          <AvatarImage src={userImg ?? "/not_found.png"} />
          <AvatarFallback>RF</AvatarFallback>
        </Avatar>
        Creado por
        <span className="ml-1">
          <strong>{userName}</strong>
        </span>
      </div>
    </>
  ) : null;

  return (
    <Link href={`/gig/title${gigQuery}`}>
      <div
        className={cardContainerCls}
        style={{
          height: `${cardHeight ? `${cardHeight}px` : '450px'}`,
          width: `${cardWidth ? `${cardWidth}px` : 'auto'}`
        }}
      >
        <div className="w-full">
          <Image
            className={
              `rounded-lg w-full h-[${imageHeight}px] drop-shadow-color`
            }
            alt="gig-card-image"
          />
        </div>

        {userInfo}

        <div className="ml-2 flex">
          <div className="my-2 mb-5">
            <h3 className="text-2xl mb-2">{title}</h3>
            <p>Desde CLP {price}</p>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default GigCard;