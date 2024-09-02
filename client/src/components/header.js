"use client";

import { _const } from "@/consts";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import Link from "next/link";
export function HeaderLeft() {
  const [user, setUser] = useState(null);
  const { sendRequest } = useFetch({
    url: _const.endpoint.auth.currentUser,
    method: "get",
    onSuccess: (data) => {
      setUser(data.user);
    },
  });
  const { sendRequest: logoutRequest } = useFetch({
    url: _const.endpoint.auth.logout,
    method: "post",
    onSuccess: () => {
      setUser(null);
      window.location.reload();
    },
  });
  useEffect(() => {
    sendRequest();
  }, []);
  return (
    <>
      {!user ? (
        <div className="flex">
          <Link href={"/signup"} className="text-secondary font-medium	text-lg">
            Sign up
          </Link>
          <p className="text-secondary font-medium	text-lg mx-1">/</p>
          <Link href={"/login"} className="text-secondary font-medium	text-lg">
            Login
          </Link>
        </div>
      ) : (
        <div className="flex">
          <p className="text-secondary font-medium	text-lg">{user.email}</p>
          <p className="text-secondary font-medium	text-lg mx-1">/</p>
          <button
            className="text-secondary font-medium	text-lg"
            onClick={logoutRequest}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}
