# 📊 Technical Architecture Flow

This diagram shows the technical architecture and layer interactions in the Nexus Pay application.

```mermaid
flowchart LR
    subgraph "Frontend Layer"
        A1[React Components] --> A2[UI State Management]
        A2 --> A3[User Interactions]
    end
    
    subgraph "Provider Layer"
        B1[Web3Provider] --> B2[NexusProvider]
        B2 --> B3[Context Management]
    end
    
    subgraph "Hook Layer"
        C1[useInitNexus] --> C2[useListenTransactions]
        C2 --> C3[Custom Hooks]
    end
    
    subgraph "Service Layer"
        D1[PYUSD SDK] --> D2[Transfer Service]
        D2 --> D3[Balance Manager]
    end
    
    subgraph "Blockchain Layer"
        E1[Ethereum Sepolia] --> E2[Arbitrum Sepolia]
        E2 --> E3[Polygon Amoy]
    end
    
    subgraph "Avail Nexus Integration"
        F1[Nexus SDK Core] --> F2[Intent Engine]
        F2 --> F3[Cross-Chain Bridge]
    end
    
    A1 --> B1
    B3 --> C1
    C3 --> D1
    D3 --> E1
    F1 --> E1
    
    style A1 fill:#e3f2fd
    style F1 fill:#fff8e1
    style E1 fill:#f1f8e9
```

## Architecture Overview

### Frontend Layer
- **React Components**: Modern React 19.1.0 components with concurrent features
- **UI State Management**: Centralized state management for UI interactions
- **User Interactions**: Event handling and user input processing

### Provider Layer
- **Web3Provider**: Wagmi configuration for Ethereum interactions
- **NexusProvider**: Avail Nexus SDK provider with context management
- **Context Management**: React Context for global state sharing

### Hook Layer
- **useInitNexus**: Custom hook for Nexus SDK initialization
- **useListenTransactions**: Real-time transaction monitoring
- **Custom Hooks**: Additional hooks for specific functionality

### Service Layer
- **PYUSD SDK**: Multi-chain PYUSD balance and transfer management
- **Transfer Service**: Cross-chain transfer orchestration
- **Balance Manager**: Real-time balance aggregation and caching

### Blockchain Layer
- **Ethereum Sepolia**: Primary testnet for PYUSD operations
- **Arbitrum Sepolia**: L2 scaling solution integration
- **Polygon Amoy**: Additional network support

### Avail Nexus Integration
- **Nexus SDK Core**: Core cross-chain functionality
- **Intent Engine**: Intent-based transaction processing
- **Cross-Chain Bridge**: Advanced bridging capabilities

## Key Integrations

1. **Next.js 15.5.4** with App Router for modern React architecture
2. **TypeScript 5** for complete type safety
3. **Wagmi 2.18.2** for type-safe Ethereum interactions
4. **Viem 2.38.3** for lightweight blockchain client
5. **Hardhat 3.0.9** for development and testing infrastructure
