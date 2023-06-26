import { Header } from "@/shared/components/Header";
import { AuthProvider } from "@/shared/contexts/Auth";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Header isLogin={pageProps.isLogin} />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
