import { Header } from "@/shared/components/Header";
import { AuthProvider } from "@/shared/contexts/Auth";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Header isLogin={pageProps.isLogin} />
      <div className="w-screen h-screen overflow-scroll overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300">
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
