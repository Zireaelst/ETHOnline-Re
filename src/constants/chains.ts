import { PYUSDTransferService } from "@/lib/pyusd-transfer";

// Supported Destination Chains for PYUSD transfers
export const SUPPORTED_DESTINATION_CHAINS = [
  { 
    id: 11155111, 
    name: 'Ethereum Sepolia',
    logo: '/ethereum-logo.png' // Add logo if needed
  },
  { 
    id: 421614, 
    name: 'Arbitrum Sepolia',
    logo: '/arbitrum-logo.png'
  },
].filter(chain => PYUSDTransferService.isChainSupported(chain.id));
