import type { Metadata } from "next";
import "@/styles/globals.css";


export const metadata: Metadata = {
  title: "MyMAST",
  description: "Login to MyMAST to manage your participation in programs from the Memorial Academy of Science and Technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
