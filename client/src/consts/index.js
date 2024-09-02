const authEndpointLocal = process.env.NEXT_PUBLIC_AUTH_ENDPOINT_LOCAL;
const ticketEndpointLocal = process.env.NEXT_PUBLIC_TICKET_ENDPOINT_LOCAL;
const orderEndpointLocal = process.env.NEXT_PUBLIC_ORDER_ENDPOINT_LOCAL;
const paymentEndpointLocal = process.env.NEXT_PUBLIC_PAYMENT_ENDPOINT_LOCAL;
const authLocal = {
  signup: authEndpointLocal + "/signup",
  login: authEndpointLocal + "/login",
  logout: authEndpointLocal + "/logout",
  currentUser: authEndpointLocal + "/current-user",
};
const ticketLocal = {
  getAll: ticketEndpointLocal + "/",
  create: ticketEndpointLocal + "/",
  update: ticketEndpointLocal + "/",
};
const orderLocal = {
  create: orderEndpointLocal + "/",
  getAll: orderEndpointLocal + "/",
};
const paymentLocal = {
  create: paymentEndpointLocal + "/",
  intent: paymentEndpointLocal + "/create-payment-intent",
};
const endpointLocal = {
  auth: authLocal,
  ticket: ticketLocal,
  order: orderLocal,
  payment: paymentLocal,
  intent: "",
};
const authEndpointKube = process.env.NEXT_PUBLIC_AUTH_ENDPOINT_KUBE;
const ticketEndpointKube = process.env.NEXT_PUBLIC_TICKET_ENDPOINT_KUBE;
const orderEndpointKube = process.env.NEXT_PUBLIC_ORDER_ENDPOINT_KUBE;
const paymentEndpointKube = process.env.NEXT_PUBLIC_PAYMENT_ENDPOINT_KUBE;
const authKube = {
  signup: authEndpointKube + "/signup",
  login: authEndpointKube + "/login",
  logout: authEndpointKube + "/logout",
  currentUser: authEndpointKube + "/current-user",
};
const ticketKube = {
  getAll: ticketEndpointKube + "/",
  create: ticketEndpointKube + "/",
  update: ticketEndpointKube + "/",
};
const orderKube = {
  create: orderEndpointKube + "/",
  getAll: orderEndpointKube + "/",
};
const paymentKube = {
  create: paymentEndpointKube + "/",
  intent: paymentEndpointKube + "/create-payment-intent",
};
const endpointKube = {
  auth: authKube,
  ticket: ticketKube,
  order: orderKube,
  payment: paymentKube,
};

export const envConst = {
  local: { endpoint: endpointLocal },
  kube: { endpoint: endpointKube },
};

function getConst() {
  if (process.env.NEXT_PUBLIC_RUN_MODE === "kube") {
    return envConst.kube;
  } else {
    return envConst.local;
  }
}
export const _const = getConst();
