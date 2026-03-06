import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://inventyvcelebration.xyz"),
  title: "Happy Women's Day",
  description: "A static International Women's Day celebration microsite with a wall of appreciation.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Happy Women's Day",
    description: "A static International Women's Day celebration microsite with a wall of appreciation.",
    url: "/",
    siteName: "Women's Day Celebration",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Happy Women's Day",
    description: "A static International Women's Day celebration microsite with a wall of appreciation.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
