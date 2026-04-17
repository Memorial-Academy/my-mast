"use client"
// import Header from "@/components/Header"
import { ErrorUI } from "@mymast/ui"
import { usePlausible } from "next-plausible"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const plausible = usePlausible();
    plausible("MajorError");
    
    return <>
        {/* <Header /> */}
        <ErrorUI error={error} reset={reset} />
    </>
}