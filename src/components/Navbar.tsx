"use client";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  //
  return (
    <nav className="p-4 md:p-6 shadow-md  min-w-screen w-full bg-white/80 backdrop-blur">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-2xl font-bold">
          Mystry Message
        </a>

        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user?.username || user?.email}
            </span>
            <Button onClick={() => signOut()}>Logout</Button>
          </>
        ) : (
          <Link href="/signin">
            <Button>Signin</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
