"use client";
import "../index.css";
import { useRouter } from "next/navigation";
import WelcomePage from "../components/WelcomePage";
import { useEffect } from "react";

const GA_TRACKING_ID = process.env.ANALYTICS_ID;

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag("config", GA_TRACKING_ID, {
        page_path: url,
      });
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return <WelcomePage>page</WelcomePage>;
};

export default Page;
