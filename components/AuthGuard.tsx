"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Props = { children: React.ReactNode };

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const publicPaths = ["/login"];

    if (!token && !publicPaths.includes(pathname)) {
      router.push("/login");
      return;
    }

    setChecked(true);
  }, [pathname, router]);

  return <>{children}</>;
}
