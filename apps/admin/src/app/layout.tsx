import type { Metadata } from "next";
import { Layout } from "@mymast/ui"
import "@/styles/global.css"
import Link from "next/link";
import { hasPermssion, PERMISSIONS } from "./lib/permissions";

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
				<header>
					<Link href="/">
						<img src="/seal.svg" alt="MAST logo" />
						<h1>MAST Admin Control Panel</h1>
					</Link>
					<nav>
						{hasPermssion(PERMISSIONS.SUPER) && <>
							<Link href="/settings">Super Secret Admin Settings</Link>
							<p>&nbsp;&nbsp;|&nbsp;&nbsp;</p>
						</>}
						<a href={process.env.NEXT_PUBLIC_MYMAST_URL}>Return to MyMAST</a>
					</nav>
				</header>
				<main>
					{children}
				</main>
			</Layout>
		</html>
	);
}
