"use client";

import axios from "axios";
import toast from "react-hot-toast";
import instance from "@/configs/axios.instance";
const { useState } = require("react");
function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}
const useFetch = ({ url, method, body, onSuccess, onFailed }) => {
  const [errors, setErrors] = useState(null);
  async function sendRequest(e) {
    try {
      let res;
      if ("method" === "get") {
        console.log(111);
        res = await instance[method](url);
      } else {
        res = await instance[method](url, body);
      }
      if (onSuccess || isFunction(onSuccess)) {
        onSuccess(res.data);
      }
      return res.response;
    } catch (error) {
      if (error?.response?.data?.errors) {
        setErrors(error.response.data.errors);
        error.response.data.errors.map((err) => {
          toast.error(err.message);
        });
      } else {
        setErrors(error);
      }
      if (onFailed || isFunction(onFailed)) {
        onFailed(error);
      }
    }
  }
  return { sendRequest, errors };
};
export default useFetch;
