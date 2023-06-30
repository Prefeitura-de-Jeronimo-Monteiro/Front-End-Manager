import {GetServerSidePropsContext} from "next";
import {parseCookies} from "nookies";
import axios from "axios";
import https from "https";

const api = (ctx?: GetServerSidePropsContext) => {
    const {BearerToken: token} = parseCookies(ctx);

    const requests = axios.create({
        baseURL: "https://localhost:44350/",
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    });

    if (token) {
        requests.defaults.headers["Authorization"] = `Bearer ${token}`;
    }

    return requests;
};

export default api;
