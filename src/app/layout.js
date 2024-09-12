import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata = {
  title: "Abubakar Ibrahim",
  description: "My Portfolio Site",
};

const GA_TRACKING_ID = process.env.ANALYTICS_ID;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div id="root">{children}</div>
      </body>
      <GoogleAnalytics gaId={GA_TRACKING_ID} />
    </html>
  );
}
