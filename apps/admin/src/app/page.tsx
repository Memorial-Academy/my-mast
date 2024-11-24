import Table from "@/components/Table";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
    title: "Admin Control Panel | Memorial Academy of Science and Technology",
    description: "Adminstrative control panel for the Memorial Academy of Science and Technology",
};

export default function Home() {
    const cookieStore = cookies();
    
    
    return (
        <>
            <h2>Scheduled Programs</h2>
            <Table columns={["Program", "Dates", "Times", "Location"]}>
                <tr><td>test</td></tr>
                <tr><td>test</td></tr>
                <tr><td>test</td></tr>
            </Table>
            <p><a href="/new_program">+ Add a program</a></p>
        </>
    );
}
