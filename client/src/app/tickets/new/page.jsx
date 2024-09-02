"use client";

import { _const } from "@/consts";
import useFetch from "@/hooks/useFetch";
import useInput from "@/hooks/useInput";
import toast, { Toaster } from "react-hot-toast";
function roundNumber(num) {
  if (isNaN(num)) {
    console.log(num);
    return;
  }
  return Number.parseFloat(num).toFixed(2);
}
export default function NewTicketPage() {
  const title = useInput();
  const price = useInput();
  const { errors, sendRequest } = useFetch({
    url: _const.endpoint.ticket.create,
    body: {
      title: title.value,
      price: roundNumber(price.value),
    },
    method: "post",
    onSuccess: (data) => {
      console.log(data);
      toast.success("Create ticket succcessful!");
      title.clear();
      price.clear();
    },
  });
  function onSubmit(e) {
    e.preventDefault();
    console.log({
      title,
      price: roundNumber(price),
    });
    sendRequest();
  }
  return (
    <div className="w-screen flex justify-center mt-20">
      <form
        className="sm:w-10/12 md:w-8/12 lg:w-96	border p-6 rounded"
        onSubmit={onSubmit}
      >
        <div className="w-full my-4">
          <label htmlFor="floatingInput" className="">
            Title
          </label>
          <input
            type="text"
            className="w-full p-4 border rounded outline-1 outline-secondary mt-3"
            id="floatingInput"
            placeholder="title"
            value={title.value}
            onChange={title.onChange}
          />
        </div>
        <div className="w-full my-4">
          <label htmlFor="floatingInput" className="">
            Price
          </label>
          <input
            type="text"
            className="w-full p-4 border rounded outline-1 outline-secondary mt-3"
            id="floatingInput"
            placeholder="10.01"
            required
            value={price.value}
            onChange={price.onChange}
          />
        </div>

        <button className="mt-6 w-full text-white bg-violet-500 rounded p-2 hover:bg-violet-600 active:bg-violet-700">
          Create
        </button>
      </form>
      <Toaster />
    </div>
  );
}
