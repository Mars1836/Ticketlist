"use client";
import { _const } from "@/consts";
import useFetch from "@/hooks/useFetch";
import useInput from "@/hooks/useInput";
import { OrderStatus } from "@cl-ticket/common";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import OrderCard from "./OrderCard";

export default function orderDetail({ params }) {
  const [orders, setOrders] = useState([]);
  const { sendRequest, errors } = useFetch({
    url: _const.endpoint.order.getAll,
    method: "get",
    onSuccess: (data) => {
      console.log(data);
      setOrders(data);
    },
  });
  useEffect(() => {
    sendRequest();
  }, []);
  return (
    <div className="px-10">
      <div className="mt-10 flex flex-wrap justify-center -ml-4 -mr-4">
        {orders.map((order) => {
          return <OrderCard order={order}></OrderCard>;
        })}
      </div>
      <Toaster></Toaster>
    </div>
  );
}
