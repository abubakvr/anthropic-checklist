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
    </html>
  );
}
