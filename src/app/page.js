"use client";
"use client";
import WelcomePage from "../components/WelcomePage";
import "../index.css";
import ReactGA from "react-ga";

const GA_TRACKING_ID = process.env.ANALYTICS_ID;
const Page = () => {
  ReactGA.initialize(GA_TRACKING_ID);
  return <WelcomePage>page</WelcomePage>;
};

export default Page;
