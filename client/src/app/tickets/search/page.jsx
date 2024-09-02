"use server";
import instance from "@/configs/axios.instance";
import { _const } from "@/consts";
import { BuyButton } from "./button";
import { Toaster } from "react-hot-toast";
import { redirect } from "next/navigation";

async function fetchTickets() {
  const res = await instance.get(_const.endpoint.ticket.getAll);

  return res.data;
}

export default async function SearchTicketPage() {
  const tickets = await fetchTickets();

  return (
    <div className="px-10">
      <div className="mt-10 flex flex-wrap justify-center -ml-4 -mr-4">
        {tickets.map((ticket) => (
          <div className="basis-1/4 pl-4 pr-4 cursor-pointer">
            <div key={ticket.title} className=" rounded-lg border">
              <div className="p-6 bg-white rounded-lg">
                <p className="font-bold text-xl mb-2 text-blue-900">
                  {ticket.title}
                </p>
                <p className="text-blue-700 text-lg font-semibold">
                  ${ticket.price}
                </p>
                <p className="text-gray-600 text-sm">
                  Posted by: {ticket.userId}
                </p>
                <p className="text-gray-500 text-sm">
                  Created at:{" "}
                  {new Date(ticket.createdAt).toLocaleDateString("en-US")}
                </p>
                <BuyButton ticket={ticket}></BuyButton>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Toaster></Toaster>
    </div>
  );
}
