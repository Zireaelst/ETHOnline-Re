// PYUSD Token Constants for Nexus Pay
export const PYUSD_ADDRESSES = {
  // Testnet addresses - Updated with correct PYUSD Sepolia address
  11155111: '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9', // Ethereum Sepolia - Correct PYUSD address
  80002: '0x0000000000000000000000000000000000000000', // Polygon Amoy - No valid PYUSD contract deployed
  421614: '0x637A1259C6afd7E3AdF63993cA7E58BB438aB1B1', // Arbitrum Sepolia
};

export const PYUSD_DECIMALS = 6; // PYUSD uses 6 decimals, not 18!

export const PYUSD_SYMBOL = 'PYUSD';
export const PYUSD_NAME = 'PayPal USD';

// Chain names for display
export const CHAIN_NAMES = {
  11155111: 'Ethereum Sepolia',
  80002: 'Polygon Amoy', 
  421614: 'Arbitrum Sepolia',
} as const;
