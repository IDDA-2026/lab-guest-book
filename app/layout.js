import "./globals.css";

export const metadata = {
  title: "The Guestbook That Won't Remember You",
  description: "Sign the guestbook… if you can get it to remember you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
