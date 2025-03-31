import { httpBatchLink } from "@trpc/client";
import { withTRPC } from "@trpc/next";
import type { AppType } from "next/app";
import { AppRouter } from "../server/root";

const MyApp: AppType = ({ Component, pageProps }) => <Component {...pageProps} />;

export default withTRPC<AppRouter>({
  config() {
    return {
      links: [httpBatchLink({ url: "/api/trpc" })],
    };
  },
})(MyApp);
