import axios from "axios";

const instance = axios.create({
  timeout: 3000,
  headers: { "X-Custom-Header": "foobar" },
  withCredentials: true,
});
export default instance;
