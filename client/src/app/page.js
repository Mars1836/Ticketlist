import Image from "next/image";
import styles from "./page.module.css";
import { cookies } from "next/headers";
import instance from "@/configs/axios.instance";
import { _const } from "@/consts";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export default async function HPage({ user }) {
  console.log("from main page: ", user);
  return <h1>asd</h1>;
}
