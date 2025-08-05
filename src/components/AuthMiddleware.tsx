import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Status = string;

export default function AuthMiddleware(
  { status, children }: { status: Status, children: ReactNode }
) {
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    }
  }, [status, router]);

  if (status === "unauthenticated") {
    return null;
  } else if (status === "authenticated") {
    return (
      <>
        {children}
      </>
    );
  }


}