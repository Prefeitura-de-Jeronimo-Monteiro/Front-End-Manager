import { GetServerSidePropsContext } from "next";
import api from "..";

export const getRoad = (ctx?: GetServerSidePropsContext) => api(ctx).get("rua");
