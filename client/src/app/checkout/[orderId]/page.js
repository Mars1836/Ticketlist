"use client";
import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "../checkoutForm";
import { CheckoutForm2 } from "../checkoutForm2";
import useFetch from "@/hooks/useFetch";
import { _const } from "@/consts";
import { Crushed } from "next/font/google";
import { useParams } from "next/navigation";

const stripe = loadStripe(
  "pk_test_51KyGNXKZP26X36ECyIfPn2FAEVU9Xif7UiW9BWy2CNq798FkooM37Rb4nauslgRO0rWBnfojmoyxKxd0m9X2lTHI00obhbyM31"
);
const loader = "auto";

const appearance = {
  theme: "stripe",
};
const clientSecret =
  "pi_3PtoVeKZP26X36EC1UTY9wlt_secret_rwnNAVcrtJwCYRQNIa1eci28q";
const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState("");
  const params = useParams();
  const { errors, sendRequest } = useFetch({
    url: _const.endpoint.payment.intent,
    method: "post",
    body: { orderId: params.orderId },
    onSuccess: (data) => {
      setClientSecret(data.client_secret);
    },
  });
  useEffect(() => {
    sendRequest();
  }, []);
  return (
    <div className="p-5 px-10">
      {clientSecret && (
        <div>
          <Elements
            stripe={stripe}
            options={{ clientSecret, appearance, loader }}
          >
            <CheckoutForm />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
