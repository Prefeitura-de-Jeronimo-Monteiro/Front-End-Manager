import { GetServerSidePropsContext } from "next";
import api from "..";

export const getChamados = (ctx?: GetServerSidePropsContext) =>
  api(ctx).get("chamado");
