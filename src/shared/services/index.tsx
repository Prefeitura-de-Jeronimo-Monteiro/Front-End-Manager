import { NextApiRequest } from "next";
import { parseCookies } from "nookies";
import axios from "axios";

const requests = (ctx?: { req: NextApiRequest }) => {
  const { BearerToken: token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://localhost:3000",
  });

  if (token) {
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  return api;
};

const api = requests();

export default api;
