import { GetServerSidePropsContext } from 'next';
import { parseCookies } from 'nookies';
import axios from 'axios';

const api = (ctx?: GetServerSidePropsContext) => {
  const { BearerToken: token } = parseCookies(ctx);

  const requests = axios.create({
    baseURL: process.env.API,
  });

  if (token) {
    requests.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  return requests;
};

export default api;
