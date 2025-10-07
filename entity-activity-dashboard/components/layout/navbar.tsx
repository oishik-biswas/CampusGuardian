"use client"

import Image from "next/image"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/placeholder-logo.png" alt="Saptang Labs logo" width={28} height={28} className="rounded" />
          <span className="font-medium">Saptang Labs</span>
        </Link>
        <ModeToggle />
      </div>
    </nav>
  )
}
