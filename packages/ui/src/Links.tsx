import React from "react"
import MYMAST_URL from "@mymast/utils/urls";
import { CopyableLink } from "./CopyableLink";

export function EmailLink({email, subject}: {email: string, subject?: string}) {
    return <a href={`mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`}>{email}</a>
}

export function PhoneNumberLink({phoneNumber}: {phoneNumber: string}) {
    return <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
}

export function VirtualProgramLink({programID}: {programID: string}) {
    // return <Link target="_blank" href={`${MYMAST_URL.CLIENT}/virtual_program/${programID}`}>{`${MYMAST_URL.CLIENT}/virtual_program/${programID}`}</Link>
    return <CopyableLink link={`${MYMAST_URL.CLIENT}/virtual_program/${programID}`} />
}