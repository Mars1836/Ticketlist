"use client";
import { usePathname, useSearchParams } from "next/navigation";
const ShowTicket = () => {
  const searchParams = useSearchParams();
  //   const { payment_intent, payment_intent_client_secret, redirect_status } =
  //     router.query;
  const payment_intent = searchParams.get("payment_intent");
  const payment_intent_client_secret = searchParams.get(
    "payment_intent_client_secret"
  );
  const redirect_status = searchParams.get("redirect_status");

  return (
    <div>
      <h1>Show Ticket</h1>
      <p>Payment Intent: {payment_intent}</p>
      <p>Payment Intent Client Secret: {payment_intent_client_secret}</p>
      <p>Redirect Status: {redirect_status}</p>
    </div>
  );
};

export default ShowTicket;
