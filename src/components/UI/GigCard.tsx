import Link from "next/link";
import { queryBuilder } from "@/lib/utils";
import Image from "@/components/UI/Image";
import clsx from 'clsx';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/shadcn/avatar";

type CardSize = 'sm' | 'md' | 'lg' | 'xl';

interface SizeConfig {
  container: string;
  image: string;
  title: string;
  price: string;
  user: string;
  showUserInfo: boolean;
}

const SIZE_CONFIG: Record<CardSize, SizeConfig> = {
  sm: {
    container: "px-2 py-2 min-h-[200px]",
    image: "h-24",
    title: "text-sm line-clamp-2",
    price: "text-xs",
    user: "text-xs",
    showUserInfo: false
  },
  md: {
    container: "px-3 py-3 min-h-[260px]",
    image: "h-32",
    title: "text-base line-clamp-2",
    price: "text-sm",
    user: "text-xs",
    showUserInfo: true
  },
  lg: {
    container: "px-4 py-4 min-h-[320px]",
    image: "h-40",
    title: "text-lg line-clamp-3",
    price: "text-base",
    user: "text-sm",
    showUserInfo: true
  },
  xl: {
    container: "px-5 py-5 min-h-[380px]",
    image: "h-48",
    title: "text-xl line-clamp-3",
    price: "text-lg",
    user: "text-sm",
    showUserInfo: true
  }
};

interface GigCardProps {
  title: string;
  price: number;
  userName?: string;
  userImg: string;
  userId: string;
  size?: CardSize;
  href?: string;
}

const GigCard: React.FC<GigCardProps> = ({
  title,
  price,
  userId,
  userName,
  userImg,
  size = 'md',
  href
}) => {

  const config = SIZE_CONFIG[size];
  const showUserInfo = config.showUserInfo && userName;

  const cardContainerCls = clsx(
    "flex flex-col w-full h-full",
    "rounded-lg dark:bg-card dark:border",
    "shadow-[0px_4px_6px_0px_rgba(81,_81,_81,_0.5)]",
    "hover:shadow-[0px_6px_8px_0px_rgba(81,_81,_81,_0.7)]",
    "hover:scale-105",
    "transition-all duration-200",
    "cursor-pointer",
    config.container
  );

  const gigQuery = queryBuilder({
    title: href ?? title,
    userId: userId
  });

  const fallBackUserImg = userImg?.trim() || "/not_found.png";

  return (
    <Link href={`/gig/title${gigQuery}`} className="block h-full">
      <div className={cardContainerCls}>
        <div className="w-full mb-3">
          <Image
            className={`rounded-lg w-full ${config.image} object-cover drop-shadow-color`}
            alt="gig-card-image"
          />
        </div>

        {showUserInfo && (
          <div className={
            `flex 
            items-center 
            ${config.user} 
            text-gray-600 
            dark:text-gray-400 
            mb-2 
            px-2`
          }>
            <Avatar className="h-4 w-4 mr-2">
              <AvatarImage src={fallBackUserImg} />
              <AvatarFallback>RF</AvatarFallback>
            </Avatar>
            <span className="truncate">
              Por <strong>{userName}</strong>
            </span>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between px-2 pb-2">
          <h3 className={`${config.title} font-semibold mb-2`}>
            {title}
          </h3>
          <p className={`${config.price} text-amber-600 font-medium`}>
            Desde CLP {price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;