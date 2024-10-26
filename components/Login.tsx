"use client";
import { fetcher } from "@/utils/fetcher";
import React from "react";

const Login = () => {
  const login = async () => {
    const token = document.cookie
      .split(";")
      .find((str) => str.includes("ACCESS_TOKEN"))
      ?.trim()
      .split("=")[1];
    const { data, error } = await fetcher("/api/login", {
      method: "POST",
      body: JSON.stringify({ email: "test@test.com", password: "test1234" }),
      includeXSRF: true,
      token,
    });
    console.log("data", data);
    console.log("err", error);
  };
  return (
    <button onClick={login} className="px-4 py-2 border rounded-md">
      Login
    </button>
  );
};

export default Login;
