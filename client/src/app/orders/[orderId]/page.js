"use client";
import { _const } from "@/consts";
import useFetch from "@/hooks/useFetch";
import useInput from "@/hooks/useInput";
import { OrderStatus } from "@cl-ticket/common";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export const statusHandled = {
  [OrderStatus.Created]: {
    label: "Waiting payment",
    color: "text-yellow-400",
  },
  [OrderStatus.Cancelled]: {
    label: "Cancelled",
    color: "text-red-500",
  },
  [OrderStatus.Finished]: {
    label: "Complete",
    color: "text-green-500",
  },
};

export default function orderDetail({ params }) {
  const [order, setOrder] = useState();
  const [time, setTime] = useState();

  const { sendRequest, errors } = useFetch({
    url: _const.endpoint.order.getAll + params.orderId,
    method: "get",
    onSuccess: (data) => {
      setOrder(data);
    },
  });
  async function handlePayment() {}
  useEffect(() => {
    sendRequest();
  }, []);
  useEffect(() => {
    if (!order) {
      return;
    }

    const timeIntervalId = setInterval(() => {
      const time = Math.floor((new Date(order.expiredAt) - new Date()) / 1000);

      if (time <= 0 && order.status === OrderStatus.Cancelled) {
        setTime();
        clearInterval(timeIntervalId);
      } else if (time <= 0 && order.status !== OrderStatus.Finished) {
        setOrder({
          ...order,
          status: OrderStatus.Cancelled,
        });
      }
      setTime(time);
    }, 1000);
    return () => {
      clearInterval(timeIntervalId);
    };
  }, [order]);
  return (
    <div className="">
      {order && (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
            <h1 className="text-2xl font-bold text-blue-600 mb-4">
              Order Details
            </h1>

            <div className="mb-4">
              <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
              <p>
                Status:{" "}
                <span
                  className={`font-medium ${statusHandled[order.status].color}`}
                >
                  {statusHandled[order.status].label}
                </span>
                <span className="ml-1">
                  {time > 0 && (
                    <span className="font-medium text-red-600">{time}s </span>
                  )}
                </span>
              </p>
            </div>

            <div className="border-t border-gray-300 my-4"></div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold">Ticket Details</h3>
              <p className="text-gray-800">Title: {order.ticketRef.title}</p>
              <p className="text-gray-800">Price: ${order.ticketRef.price}</p>
              <p className="text-gray-600">Ticket ID: {order.ticketRef.id}</p>
              <p className="text-gray-600">
                Ticket Created At:{" "}
                {new Date(order.ticketRef.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-600">
                Ticket Updated At:{" "}
                {new Date(order.ticketRef.updatedAt).toLocaleString()}
              </p>
            </div>

            <div className="border-t border-gray-300 my-4"></div>

            <div className="text-sm text-gray-600">
              <p>User ID: {order.userId}</p>
              <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
              <p>Expired At: {new Date(order.expiredAt).toLocaleString()}</p>
              <p>Updated At: {new Date(order.updatedAt).toLocaleString()}</p>
            </div>
          </div>
          <Link
            className="px-10 py-2 bg-blue-500 text-white font-medium"
            href={`/checkout/${order.id}`}
          >
            Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
