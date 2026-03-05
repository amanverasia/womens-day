import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy Women's Day",
  description: "A static International Women's Day celebration microsite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
