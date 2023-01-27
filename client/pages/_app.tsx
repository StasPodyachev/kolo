import "@rainbow-me/rainbowkit/styles.css";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { filecoinHyperspace, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import theme from "@/theme";
import "../styles/globals.css";
import { SidebarContextProvider } from "@/context/SidebarContext";

const { chains, provider } = configureChains(
  [
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [filecoinHyperspace, polygonMumbai]
      : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Kolo",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        showRecentTransactions={true}
        modalSize="compact"
        theme={darkTheme({
          accentColor: "#3A3D4D",
          accentColorForeground: "white",
          borderRadius: "medium",
          overlayBlur: "none",
        })}
        chains={chains}
      >
        <ChakraProvider theme={theme}>
          <SidebarContextProvider>
            <Component {...pageProps} />
          </SidebarContextProvider>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
