import { type AppType } from "next/app";

import { ClerkProvider } from "@clerk/nextjs";
import { ChakraProvider } from "@chakra-ui/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return  (
    <ChakraProvider>
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
