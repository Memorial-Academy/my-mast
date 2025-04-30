"use client"
// import Header from "@/components/Header"
import { ErrorUI } from "@mymast/ui"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return <>
        {/* <Header /> */}
        <ErrorUI error={error} reset={reset} />
    </>
}