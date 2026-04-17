import Header from "@/components/Header";
import { NotFoundUI } from "@mymast/ui";
import { usePlausible } from "next-plausible";

export default function NotFound() {
    const plausible = usePlausible();
    plausible("404");

    return <>
        <Header />
        <NotFoundUI />
    </>
}