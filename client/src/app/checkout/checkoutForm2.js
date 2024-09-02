import { PaymentElement } from "@stripe/react-stripe-js";

export const CheckoutForm2 = () => {
  return (
    <form>
      <PaymentElement />
      <button>Submit</button>
    </form>
  );
};
