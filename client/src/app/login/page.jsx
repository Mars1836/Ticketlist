"use client";
import { _const } from "@/consts";
import useFetch from "@/hooks/useFetch";
import useInput from "@/hooks/useInput";
import axios from "axios";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function login() {
  const email = useInput();
  const password = useInput();
  const router = useRouter();

  const { sendRequest } = useFetch({
    url: _const.endpoint.auth.login,
    method: "post",
    body: {
      email: email.value,
      password: password.value,
    },
    onSuccess: () => {
      toast.success("Login successful.");
      window.location.href = "/";
    },
  });
  const onSubmit = async (e) => {
    e.preventDefault();
    await sendRequest();
  };
  useEffect(() => {}, []);
  return (
    <div className="w-screen flex justify-center mt-20">
      <form
        className="sm:w-10/12 md:w-8/12 lg:w-96	border p-6 rounded"
        onSubmit={onSubmit}
      >
        <div className="text-center text-xl font-bold text-blue-500">
          Login to Tickfy
        </div>
        <div className="w-full my-4">
          <label htmlFor="floatingInput" className="">
            Email address
          </label>
          <input
            type="email"
            className="w-full p-4 border rounded outline-1 outline-secondary mt-3"
            id="floatingInput"
            placeholder="name@example.com"
            required
            {...email}
          />
        </div>
        <div className="form-floating ">
          <label htmlFor="floatingPassword">Password</label>
          <input
            type="password"
            className="w-full p-4 border rounded outline-1 outline-secondary mt-3"
            id="floatingPassword"
            placeholder="Password"
            {...password}
          />
        </div>
        <button className="mt-6 w-full text-white bg-violet-500 rounded p-2 hover:bg-violet-600 active:bg-violet-700">
          Sign up
        </button>
      </form>
      <Toaster />
    </div>
  );
}
