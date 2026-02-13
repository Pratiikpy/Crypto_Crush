import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [farcasterFrame()],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});
