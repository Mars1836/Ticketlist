"use client";
import { _const } from "@/consts";
import useFetch from "@/hooks/useFetch";
import useInput from "@/hooks/useInput";
import axios from "axios";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function orderDetail({ params }) {
  const orderId = params.orderId;
  return (
    <div className="">
      <div>{orderId}</div>
    </div>
  );
}
