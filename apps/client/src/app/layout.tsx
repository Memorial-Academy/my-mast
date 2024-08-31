import type { Metadata } from "next";
import { Layout }  from "@mymast/ui"

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
      <Layout>
        {children}
      </Layout>
    </html>
  );
}
