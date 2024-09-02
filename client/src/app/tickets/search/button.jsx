"use client";

import { _const } from "@/consts";
import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

async function createOrders(ticketId) {
  const res = await instance.post(_const.endpoint.order.create);
  return res;
}
export function BuyButton({ ticket }) {
  const router = useRouter();

  const { errors, sendRequest } = useFetch({
    url: _const.endpoint.order.create,
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (data) => {
      toast.success("Create order success");
      router.push(`/orders/${data.id}`);
    },
    onFailed: (error) => {
      console.log(error);
    },
  });
  return (
    <button
      className="px-4 py-2 rounded bg-blue-500 text-white mt-4"
      onClick={() => {
        sendRequest();
      }}
    >
      Buy
    </button>
  );
}
