"use client";
import Login from "@/components/Login";
import { fetcher } from "@/utils/fetcher";
import Link from "next/link";
import React from "react";

const page = () => {
  const getUser = async () => {
    const { data, error } = await fetcher("/api/user");
    console.log("data", data);
    console.log("err", error);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-xl">Its Client</h1>
        <Login />
        <button onClick={getUser} className="px-4 py-2 border rounded-md">
          Fetch user
        </button>
        <Link href="/">SSR</Link>
      </main>
    </div>
  );
};

export default page;
