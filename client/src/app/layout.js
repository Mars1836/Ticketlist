import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { HeaderLeft } from "@/components/header";
import { _const } from "@/consts";
import instance from "@/configs/axios.instance";
import { cookies } from "next/headers";
import React from "react";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
async function getCurrentUser() {
  // const cookie = req.headers.get("cookie") || "";
  const cookieStore = cookies().get("session");
  let cookieAuth = "";
  if (cookieStore) {
    cookieAuth = cookieStore.name + `=` + cookieStore.value;
  }

  try {
    const test = _const.endpoint.auth.currentUser;
    const res = await instance.get(test, {
      headers: {
        cookie: cookieAuth,
        // Host: "ticketdev.com",
      },
    });
    return res.data;
  } catch (error) {
    if (!error.response) {
      return console.log(error);
    }
    console.log(error.response.data.errors);
  }
}
export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="border-b h-16 flex justify-between md:px-20 items-center">
          <Link href={"/"}>
            <Image
              src={"/logo1.png"}
              width={140}
              height={100}
              className="cursor-pointer"
            ></Image>
          </Link>
          <div>
            <a href={"/tickets/search"}>Ticket</a>
            <Link href={"/orders/show"}>Order</Link>
          </div>
          <HeaderLeft></HeaderLeft>
        </nav>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
