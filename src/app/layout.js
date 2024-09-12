import { GoogleAnalytics } from "@next/third-parties/google";

const GA_TRACKING_ID = process.env.ANALYTICS_ID;

export const metadata = {
  title: "My App",
  description: "My App is a checklist app",
};

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
