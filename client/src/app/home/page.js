import instance from "@/configs/axios.instance";
import { _const, envConst } from "@/consts";
import { cookies } from "next/headers";

async function getCurrentUser() {
  try {
    const res = await instance.get(_const.endpoint.auth.currentUser);
    return res;
  } catch (error) {
    if (!error.response) {
      return console.log(error);
    }
    console.log(error.response.data.errors);
  }
}
export default async function HomePage() {
  // const cookie = cookies().getAll();
  // const res = await getCurrentUser();
  // console.log(res);
  return <h1>asd</h1>;
}
