import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShopLux | Premium Online Store",
  description: "Discover premium products at ShopLux — your go-to destination for exclusive collections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
