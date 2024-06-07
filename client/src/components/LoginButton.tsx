"use client";
import React from "react";
import { useFormStatus } from "react-dom";

export function LoginButton() {
  const { pending } = useFormStatus()

  const handleClick = (event: React.MouseEvent) => {
    if (pending) {
        event.preventDefault()
    }
  }

  return (
    <button aria-disabled={pending} type="submit" onClick={handleClick}>
        Login
    </button>
  )
}