"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export const useRedirection = (id: string, currentIndex: string) => {
  const router = useRouter();
  const pathname = usePathname();
  console.log("useredirection pathname", pathname);
  const [hasBeenRedirected, setHasBeenRedirected] = useState<boolean>(false);

  const redirectedPaths = () => {
    const redirected = sessionStorage.getItem("redirected");
    return redirected ? JSON.parse(redirected) : [];
  };

  useEffect(() => {
    const currentPath = { id, index: currentIndex.toString() }; // Ensure index is a string
    const paths = redirectedPaths();

    console.log(paths, id, currentIndex, "..sss");
    setHasBeenRedirected(
      paths.some(
        (path) => path.id === currentPath.id && path.index === currentPath.index
      )
    );
  }, [id, currentIndex, pathname]);

  const saveToSession = (sessionData: { id: string; index: string }) => {
    const paths = redirectedPaths();
    if (
      !paths.some(
        (path) => path.id === sessionData.id && path.index === sessionData.index
      )
    ) {
      paths.push(sessionData);
      sessionStorage.setItem("redirected", JSON.stringify(paths));
    }
  };

  const redirect = (route: string): void => {
    router.push(`${route}?redirected=true`);
  };

  return { hasBeenRedirected, redirect, saveToSession };
};
