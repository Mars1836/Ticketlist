const authEndpointLocal = process.env.NEXT_PUBLIC_AUTH_ENDPOINT_LOCAL;
const auth = {
  signup: authEndpointLocal + "/signup",
  login: authEndpointLocal + "/login",
  logout: authEndpointLocal + "/logout",
  currentUser: authEndpointLocal + "/current-user",
};
export const endpointLocal = {
  auth,
};
