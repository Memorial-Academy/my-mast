import type { Metadata } from "next";
import { Layout }  from "@mymast/ui"
import PlausibleProvider from "next-plausible";

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
        <PlausibleProvider src={process.env.NEXT_PUBLIC_CLIENT_ANALYTICS}>
          {children}
        </PlausibleProvider>
      </Layout>
    </html>
  );
}
