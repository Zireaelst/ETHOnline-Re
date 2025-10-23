# Nexus Pay - Unified Cross-Chain Wallet

A revolutionary Web3 application that provides a unified interface for managing and transferring USDC across multiple blockchain networks using Avail Nexus SDK.

## 🚀 Features

- **Unified Balance View**: See your total USDC balance across all supported chains in one place
- **Cross-Chain Transfers**: Send USDC to any supported destination chain with a single click
- **Avail Nexus Integration**: Powered by Avail's cutting-edge cross-chain infrastructure
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Web3**: Wagmi, Viem, ConnectKit
- **Cross-Chain**: Avail Nexus SDK
- **Testing**: Hardhat 3 (Network Forking for Development)

## 🏗️ Architecture

### Frontend Components
- `USDCBalance`: Displays unified USDC balance across all chains
- `TransferForm`: Handles cross-chain transfer inputs and validation
- `NexusProvider`: Manages Avail Nexus SDK integration

### Supported Chains
- Ethereum Sepolia
- Polygon Amoy  
- Arbitrum Sepolia

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Note: Currently using Node.js 23 with compatibility workarounds)
- npm or yarn
- MetaMask wallet

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nexus-pay
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Development

### Hardhat 3 Integration

This project leverages **Hardhat 3**'s network forking capabilities for enhanced development and testing:

```typescript
// hardhat.config.ts
networks: {
  hardhat: {
    forking: {
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      blockNumber: 5000000
    }
  }
}
```

**How Hardhat 3 Enhances Development:**
- **Local Network Forking**: Run a local copy of Sepolia network for testing
- **Real Contract Simulation**: Test with actual contract states and balances
- **Faster Iteration**: No need to deploy to testnets for every change
- **Cost-Effective**: Test complex scenarios without spending gas fees

### Testing Cross-Chain Functionality

1. Start Hardhat fork:
```bash
npx hardhat node --fork https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

2. Test the application with real network conditions locally

## 🌐 Supported Networks

| Network | Chain ID | Status |
|---------|----------|--------|
| Ethereum Sepolia | 11155111 | ✅ Supported |
| Polygon Amoy | 80002 | ✅ Supported |
| Arbitrum Sepolia | 421614 | ✅ Supported |

## 💡 Future Enhancements

- **PYUSD Support**: Full integration with PayPal's PYUSD token
- **Additional Chains**: Support for more blockchain networks
- **Advanced Features**: Batch transfers, scheduled payments
- **Mobile App**: React Native version for mobile users

## 🔒 Security

- All transactions are processed through Avail Nexus SDK
- Private keys never leave the user's wallet
- Smart contract interactions are verified and audited

## 📱 Demo

1. Connect your MetaMask wallet
2. Initialize Nexus SDK
3. View your unified USDC balance
4. Enter recipient address and amount
5. Select destination chain
6. Confirm transaction

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Avail Project**: For providing the Nexus SDK
- **PayPal**: For PYUSD token inspiration
- **Hardhat Team**: For excellent development tools
- **Web3 Community**: For continuous innovation

---

**Note**: This is a hackathon project demonstrating cross-chain capabilities. PYUSD support is planned for future releases once integrated into the Avail Nexus SDK.