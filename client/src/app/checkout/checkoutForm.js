import { loadStripe } from "@stripe/stripe-js";
import {
  useStripe,
  useElements,
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  // If collecting shipping
  AddressElement,
} from "@stripe/react-stripe-js";

const stripe = loadStripe(
  "pk_test_51KyGNXKZP26X36ECyIfPn2FAEVU9Xif7UiW9BWy2CNq798FkooM37Rb4nauslgRO0rWBnfojmoyxKxd0m9X2lTHI00obhbyM31"
);

const appearance = {
  /* ... */
};

// Enable the skeleton loader UI for the optimal loading experience.
const loader = "auto";

const CheckoutPage = ({ clientSecret }) => (
  <Elements stripe={stripe} options={{ clientSecret, appearance, loader }}>
    <CheckoutForm />
  </Elements>
);

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3999/checkout/success",
      },
    });

    if (error) {
      // Handle error here (e.g., display an error message)
      console.error(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Payment succeeded, redirect to a success page
      router.push("/");
    } else {
      // Handle other statuses or outcomes if needed
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <LinkAuthenticationElement />

      <PaymentElement />

      <button type="submit">Submit</button>
    </form>
  );
}
