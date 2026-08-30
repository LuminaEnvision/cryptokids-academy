import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'viem/chains';
import { getBlockchainConfig } from './config';

const config = getBlockchainConfig();

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(config.rpcUrl),
  },
});

