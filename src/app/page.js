"use client";
import "../index.css";
import { useRouter } from "next/navigation";
import WelcomePage from "../components/WelcomePage";
import { useEffect } from "react";

const GA_TRACKING_ID = process.env.ANALYTICS_ID;

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    // Ensure this runs only in the browser (client-side)
    if (typeof window !== "undefined" && router.events) {
      const handleRouteChange = (url) => {
        console.log("App is changing to: ", url);
        // Add your Google Analytics event or any other logic here
        window.gtag("config", GA_TRACKING_ID, {
          page_path: url,
        });
      };

      // Listen to route changes
      router.events.on("routeChangeComplete", handleRouteChange);

      // Clean up the listener on component unmount
      return () => {
        router.events.off("routeChangeComplete", handleRouteChange);
      };
    }
  }, [router.events]);

  return <WelcomePage>page</WelcomePage>;
};

export default Page;
