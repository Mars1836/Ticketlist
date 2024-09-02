import { NextResponse } from "next/server";
import { _const } from "./consts";
import instance from "./configs/axios.instance";
async function getCurrentUser(req) {
  const cookie = req.headers.get("cookie") || "";

  try {
    const test = _const.endpoint.auth.currentUser;
    console.log(test);
    const res = await instance.get(test, {
      headers: {
        cookie: cookie,
        Host: "ticketdev.com",
      },
    });
    console.log(res);
    return res.data;
  } catch (error) {
    if (!error.response) {
      return console.log(error);
    }
    console.log(error.response.data.errors);
  }
}
export async function middleware(req) {
  let res = await getCurrentUser(req);
  console.log(res);
  if (!res) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/home", "/tickets/new"],
};
