import { headers } from "next/headers";
import WelcomePage from "../components/WelcomePage";
import "../index.css";

const Page = () => {
  const ipAddress = headers().get("x-client-ip");

  return <WelcomePage ipAddress={ipAddress} />;
};

export default Page;
