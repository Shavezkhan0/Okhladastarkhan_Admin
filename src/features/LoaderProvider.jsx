"use client";
import {useRouter}  from "next/router"; // Changed import
import { useEffect, useState } from "react";

import LoadingBar from "react-top-loading-bar";

const LoaderProvider = ({ children }) => {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleStart = () => {
      console.log("Route change started"); 
      setProgress(30); // Start loading
    };
    const handleComplete = () => {
      console.log("Route change completed"); 
      setProgress(100); // Complete loading
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.events]);

  return (
    <>
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => {
          console.log("Loader finished"); // Debugging statement
          setProgress(0);
        }}
      />
      {children}
    </>
  );
};

export default LoaderProvider;
