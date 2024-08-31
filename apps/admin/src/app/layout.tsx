import type { Metadata } from "next";
import { Layout } from "@mymast/ui"

export const metadata: Metadata = {
  title: "Admin Control Panel | Memorial Academy of Science and Technology",
  description: "Adminstrative control panel for the Memorial Academy of Science and Technology",
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
