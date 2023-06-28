import { NextApiRequest } from "next";
import { parseCookies } from "nookies";
import axios from "axios";

const api = (ctx?: { req: NextApiRequest }) => {
  const { BearerToken: token } = parseCookies(ctx);

  const requests = axios.create({
    baseURL: "http://localhost:3000",
  });

  if (token) {
    requests.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  return requests;
};

export default api;
