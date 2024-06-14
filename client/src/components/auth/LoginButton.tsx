"use client";
import React from "react";
import { useFormStatus } from "react-dom";

export default function LoginButton() {
  const { pending } = useFormStatus()

  const handleClick = (event: React.MouseEvent) => {
    if (pending) {
        event.preventDefault();
        alert("Please enter an email address and password.");
    }
  }

  return (
    <input disabled={pending} type="submit" onClick={handleClick}  value="Login"/>
  )
}