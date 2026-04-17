"use client";
import { NotFoundUI } from "@mymast/ui";
import { usePlausible } from "next-plausible";

export default function AnalyticsSafe_NotFound() {
    const plausible = usePlausible();
    plausible("404");

    return <NotFoundUI />
}