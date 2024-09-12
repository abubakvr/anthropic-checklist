"use client";
"use client";
import WelcomePage from "../components/WelcomePage";
import "../index.css";
import ReactGA from "react-ga";
import { useEffect } from "react";

const GA_TRACKING_ID = process.env.ANALYTICS_ID;
const Page = () => {
  useEffect(() => {
    ReactGA.initialize(GA_TRACKING_ID);
  }, []);
  return <WelcomePage>page</WelcomePage>;
};

export default Page;
