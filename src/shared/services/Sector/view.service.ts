import {GetServerSidePropsContext} from "next";
import api from "..";

export const getSector = (ctx?: GetServerSidePropsContext) =>
    api(ctx).get("setor");
