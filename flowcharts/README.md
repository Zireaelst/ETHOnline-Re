# 📋 Flowcharts Overview

This directory contains comprehensive flowcharts and diagrams for the Nexus Pay project, providing visual documentation of the system architecture, user flows, and data interactions.

## 📁 Contents

### 1. [User Flow](./user-flow.md)
Complete user journey from application opening to transaction completion, including:
- Wallet connection process
- Nexus SDK initialization
- Balance aggregation and display
- Transfer form interaction
- Cross-chain intent creation and execution
- Error handling and recovery

### 2. [Technical Architecture](./technical-architecture.md)
High-level technical architecture showing layer interactions:
- Frontend layer (React components, UI state management)
- Provider layer (Web3Provider, NexusProvider)
- Hook layer (custom hooks for Nexus and transactions)
- Service layer (PYUSD SDK, transfer services)
- Blockchain layer (multiple testnet support)
- Avail Nexus integration

### 3. [Data Flow](./data-flow.md)
Detailed data flow between components and external services:
- User interface interactions
- State management patterns
- API layer communications
- External service integrations
- Real-time update mechanisms

## 🎯 Purpose

These flowcharts serve multiple purposes:

- **Development Documentation**: Visual guides for developers working on the project
- **ETH Online 2025 Submission**: Clear demonstration of technical implementation
- **Architecture Overview**: High-level system understanding for stakeholders
- **Debugging Reference**: Visual aid for troubleshooting system interactions

## 🛠️ Technologies Visualized

- **Next.js 15.5.4** with App Router
- **React 19.1.0** with concurrent features
- **Avail Nexus Core SDK v0.0.1**
- **PYUSD testnet contracts**
- **Wagmi 2.18.2** for Web3 interactions
- **Hardhat 3.0.9** for development infrastructure

## 📊 Mermaid Diagrams

All diagrams are created using Mermaid syntax for:
- Easy version control integration
- GitHub native rendering
- Documentation consistency
- Interactive elements

## 🔄 Usage

These flowcharts can be viewed:
1. **GitHub**: Native Mermaid rendering in markdown files
2. **VS Code**: With Mermaid preview extensions
3. **Documentation sites**: Direct markdown rendering
4. **Presentation tools**: Export to images for presentations

## 🎨 Color Coding

- **Blue tones**: Frontend and UI components
- **Purple tones**: Core business logic and state management
- **Green tones**: Blockchain and external services
- **Orange tones**: Avail Nexus specific components
- **Red tones**: Error states and handling

---

*Created for ETH Online 2025 - Nexus Pay: PYUSD Cross-Chain Bridge*
