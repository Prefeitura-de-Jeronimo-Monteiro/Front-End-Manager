import {GetServerSidePropsContext} from "next";
import api from "..";

export const getNeighborhood = (ctx?: GetServerSidePropsContext) =>
  api(ctx).get("bairro");
