import React from "react"

export function EmailLink({email, subject}: {email: string, subject?: string}) {
    return <a href={`mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`}>{email}</a>
}

export function PhoneNumberLink({phoneNumber}: {phoneNumber: string}) {
    return <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
}