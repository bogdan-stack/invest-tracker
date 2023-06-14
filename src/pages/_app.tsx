import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { ChakraProvider } from "@chakra-ui/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Source_Sans_Pro } from '@next/font/google';
import { motion, AnimatePresence } from "framer-motion";
import Navbtn from "~/components/Navbtn";
import Footer from "~/components/Footer";


const sourceSans = Source_Sans_Pro({
  subsets: ['latin'],
  weight: ['200','300','400','600','700'],
});


const MyApp: AppType = ({ Component, pageProps }) => {
  return  (
    <main className={sourceSans.className}>
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15}}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ delay: 0.75 }}
        >
    <ChakraProvider>
    <ClerkProvider {...pageProps}>
      <Navbtn />
      <Component {...pageProps} />
      <Footer />
    </ClerkProvider>
    </ChakraProvider>
    </motion.div>
    </AnimatePresence>
    </main>
  );
};

export default api.withTRPC(MyApp);
