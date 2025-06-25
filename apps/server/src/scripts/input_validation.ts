// Email address
const emailRegex = new RegExp(/([a-z0-9]|\.|\_)+@.+(\..+)/);

export function validateEmail(email: string) {
    email = email.toLowerCase();
    return emailRegex.test(email);
}

// Phone numbers
// only accept phone numbers submitted by the auto-formatted <PhoneNumberInput /> element
const phoneRegex = new RegExp(/\([0-9]{3}\) [0-9]{3}\-[0-9]{4}/);

export function validatePhoneNumber(phone: string) {
    return phoneRegex.test(phone);
}

// generic validation
import { Response } from "express";
export function validateData(data: any, res: Response) {
    if (data) {
        return data;
    } else {
        res.writeHead(400);
        res.end("Ensure all required information is submitted");
        return;
    }
}