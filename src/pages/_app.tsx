import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { ChakraProvider } from "@chakra-ui/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Source_Sans_Pro } from '@next/font/google';


const sourceSans = Source_Sans_Pro({
  subsets: ['latin'],
  weight: ['200','300','400','600','700'],
});


const MyApp: AppType = ({ Component, pageProps }) => {
  return  (
    <main className={sourceSans.className}>
    <ChakraProvider>
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
    </ChakraProvider>
    </main>
  );
};

export default api.withTRPC(MyApp);
