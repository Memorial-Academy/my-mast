import Header from "@/components/Header";
import "@/styles/join_virtual_camp.css";


export default function JoinVirtualCampLayout({ children }: { children: React.ReactNode}) {
    return (
        <>
            <Header/>
            <main className="join-virtual-camp">
                {children}
            </main>
        </>
    )
}