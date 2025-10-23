import "@nomicfoundation/hardhat-toolbox";

const config = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      // Local test network for development and testing
      forking: {
        url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY", // Replace with actual RPC URL
        blockNumber: 5000000 // Use a recent block number
      }
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY", // Replace with actual RPC URL
      accounts: [], // Add private keys for testing
    },
    polygonAmoy: {
      url: "https://polygon-amoy.infura.io/v3/YOUR_INFURA_KEY", // Replace with actual RPC URL
      accounts: [], // Add private keys for testing
    },
    arbitrumSepolia: {
      url: "https://arbitrum-sepolia.infura.io/v3/YOUR_INFURA_KEY", // Replace with actual RPC URL
      accounts: [], // Add private keys for testing
    }
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
};

export default config;
