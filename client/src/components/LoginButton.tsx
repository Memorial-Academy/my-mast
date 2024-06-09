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
    <button disabled={pending} type="submit" onClick={handleClick}>
        Login
    </button>
  )
}