const authEndpointKube = process.env.NEXT_PUBLIC_AUTH_ENDPOINT_KUBE;
const auth = {
  signup: authEndpointKube + "/signup",
  login: authEndpointKube + "/login",
  logout: authEndpointKube + "/logout",
  currentUser: authEndpointKube + "/current-user",
};
export const endpointKube = {
  auth,
};
