'use client';
import Link from "next/link";
import { queryBuilder } from "@/lib/utils";
import Image from "@/components/UI/Image";
import clsx from 'clsx';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/shadcn/avatar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MouseEvent } from 'react';

type CardSize = 'sm' | 'md' | 'lg' | 'xl';
interface SizeConfig {
  container: string;
  image: string;
  title: string;
  price: string;
  user: string;
  showUserInfo: boolean;
}

interface GigCardProps {
  title: string;
  price: number;
  userName?: string;
  userImg: string;
  userId: string;
  size?: CardSize;
  href?: string;
  editable?: boolean;
  gigId?: string;
  gigImg?: string;
}

const SIZE_CONFIG: Record<CardSize, SizeConfig> = {
  sm: {
    container: "px-2 py-2",
    image: "h-30",
    title: "text-xs line-clamp-2 mt-2",
    price: "text-xs",
    user: "text-xs",
    showUserInfo: false
  },
  md: {
    container: "px-3 py-3",
    image: "h-35",
    title: "text-sm line-clamp-2",
    price: "text-sm",
    user: "text-xs mt-2",
    showUserInfo: true
  },
  lg: {
    container: "px-4 py-4",
    image: "h-50",
    title: "text-base line-clamp-3",
    price: "text-base",
    user: "text-sm mt-4",
    showUserInfo: true
  },
  xl: {
    container: "px-5 py-5",
    image: "h-50",
    title: "text-lg line-clamp-3",
    price: "text-lg",
    user: "text-sm mt-4",
    showUserInfo: true
  }
};

const GigCard: React.FC<GigCardProps> = ({
  title,
  price,
  userId,
  userName,
  userImg,
  editable,
  gigId,
  size = 'md',
  href,
  gigImg
}) => {
  const [responsiveSize, setResponsiveSize] = useState<CardSize>(size);
  const [formattedPrice, setFormattedPrice] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;
      if (width >= 1920) setResponsiveSize('xl');
      else if (width >= 1650) setResponsiveSize('xl');
      else if (width >= 1280) setResponsiveSize('lg');
      else if (width >= 800) setResponsiveSize('md');
      else if (width >= 768) setResponsiveSize('sm');
      else setResponsiveSize('sm');
    };

    setFormattedPrice(price.toLocaleString());
    checkSize();

    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, [price]);

  const config = SIZE_CONFIG[responsiveSize];

  const getDisplayTitle = (title: string, currentSize: CardSize) => {
    switch (currentSize) {
      case 'sm':
        return title.length > 15 ? title.slice(0, 12) + '...' : title;
      case 'md':
        return title.length > 20 ? title.slice(0, 17) + '...' : title;
      case 'lg':
        return title.length > 25 ? title.slice(0, 22) + '...' : title;
      case 'xl':
        return title.length > 30 ? title.slice(0, 27) + '...' : title;
      default:
        return title;
    }
  };

  const displayTitle = getDisplayTitle(title, responsiveSize);

  const cardContainerCls = clsx(
    "flex flex-col w-full h-full",
    "rounded-lg bg-card border",
    "shadow-[0px_4px_6px_0px_rgba(81,_81,_81,_0.5)]",
    "hover:shadow-[0px_6px_8px_0px_rgba(81,_81,_81,_0.7)]",
    "transition-all duration-200",
    "cursor-pointer",
    config.container
  );

  const gigQuery = queryBuilder({
    title: href ?? title,
    userId: userId
  });

  const handleEditClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/gig/edit/${gigId}`);
  };

  const fallBackUserImg = userImg?.trim() || "/not_found.png";

  return (
    <Link href={`/gig/title${gigQuery}`} className="flex w-full h-full">
      <div className={cardContainerCls}>
        <div className={`w-full ${config.image} mb-1 flex-shrink-0 relative`}>
          {
            (editable && gigId) && (
              <div
                onClick={(e) => handleEditClick(e)}
                className="
                  absolute 
                  bg-accent/80
                  text-white
                  right-2 
                  top-2 
                  p-2 
                  rounded-lg 
                  border-2
                  border-foreground/90
                "
              >
                🖊
              </div>
            )
          }
          <Image
            className="rounded-lg w-full h-full object-cover drop-shadow-color border-2"
            alt="gig-card-image"
            src={gigImg ?? ''}
          />
        </div>

        {config.showUserInfo && userName && (
          <div className={
            `flex 
              items-center 
              ${config.user} 
              text-gray-600 
              dark:text-gray-400 
              mb-1 
              flex-shrink-0`
          }>
            <Avatar className="h-4 w-4 mr-1">
              <AvatarImage src={fallBackUserImg} />
              <AvatarFallback>RF</AvatarFallback>
            </Avatar>
            <span className="truncate">Por {userName}</span>
          </div>
        )}

        <div className="flex flex-col flex-1 min-h-0 w-full justify-between">
          <h3 className={`${config.title} text-muted-foreground font-semibold w-full`}>
            {displayTitle}
          </h3>
          <p className={`${config.price} text-primary font-medium w-full mt-1`}>
            Desde CLP {formattedPrice || price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;