import React from "react"
import Link from "next/link"
import MYMAST_URL from "@mymast/utils/urls";

export function EmailLink({email, subject}: {email: string, subject?: string}) {
    return <a href={`mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`}>{email}</a>
}

export function PhoneNumberLink({phoneNumber}: {phoneNumber: string}) {
    return <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
}

export function VirtualProgramLink({programID}: {programID: string}) {
    return <Link target="_blank" href={`${MYMAST_URL.CLIENT}/virtual_program/${programID}`}>{`${MYMAST_URL.CLIENT}/virtual_program/${programID}`}</Link>
}