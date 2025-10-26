# 🔄 Nexus Pay - User Flow Chart

This flowchart shows the complete user journey from opening the application to completing a cross-chain PYUSD transfer.

```mermaid
flowchart TD
    A[User Opens Nexus Pay] --> B{Wallet Connected?}
    
    B -->|No| C[Click Connect Wallet]
    C --> D[MetaMask Connection]
    D --> E[Wallet Connected Successfully]
    
    B -->|Yes| F{Nexus SDK Initialized?}
    E --> F
    
    F -->|No| G[Click Connect Nexus]
    G --> H[Initialize Nexus SDK]
    H --> I[Attach Event Hooks]
    I --> J[SDK Ready]
    
    F -->|Yes| K[Main Dashboard]
    J --> K
    
    K --> L[PYUSD Balance Component]
    L --> M[Fetch Multi-Chain Balances]
    M --> N[Ethereum Sepolia Balance]
    M --> O[Arbitrum Sepolia Balance]
    M --> P[Polygon Amoy Balance]
    
    N --> Q[Aggregate Total Balance]
    O --> Q
    P --> Q
    Q --> R[Display Unified Portfolio]
    
    K --> S[Transfer Form]
    S --> T[Enter Recipient Address]
    T --> U[Enter Amount]
    U --> V[Select Destination Chain]
    V --> W[Validate Input]
    
    W -->|Invalid| X[Show Error Message]
    X --> S
    
    W -->|Valid| Y[Submit Transfer]
    Y --> Z{Using Nexus Bridge?}
    
    Z -->|Yes| AA[Create Cross-Chain Intent]
    AA --> BB[Nexus Intent Hook Triggered]
    BB --> CC[Show Intent Modal]
    CC --> DD{User Approves?}
    
    DD -->|No| EE[Cancel Transaction]
    EE --> K
    
    DD -->|Yes| FF[Execute Intent]
    FF --> GG[Real-time Progress Tracking]
    GG --> HH[Step-by-step Updates]
    HH --> II{Transaction Complete?}
    
    II -->|No| JJ[Continue Monitoring]
    JJ --> HH
    
    II -->|Yes| KK[Success Notification]
    KK --> LL[Update Balances]
    LL --> K
    
    Z -->|No| MM[Direct PYUSD Transfer]
    MM --> NN{Chain Switch Needed?}
    
    NN -->|Yes| OO[Switch to Target Chain]
    OO --> PP[Execute ERC-20 Transfer]
    
    NN -->|No| PP
    PP --> QQ[Wait for Confirmation]
    QQ --> RR[Transaction Success]
    RR --> LL
    
    %% Error Handling
    AA -->|Error| SS[Handle Intent Error]
    FF -->|Error| TT[Handle Execution Error]
    PP -->|Error| UU[Handle Transfer Error]
    
    SS --> VV[Show Error Message]
    TT --> VV
    UU --> VV
    VV --> K
    
    %% Background Processes
    WW[Background Balance Refresh] --> M
    XX[Event Listeners] --> GG
    YY[Cache Management] --> Q
    
    style A fill:#e1f5fe
    style K fill:#f3e5f5
    style AA fill:#fff3e0
    style CC fill:#e8f5e8
    style KK fill:#e8f5e8
    style VV fill:#ffebee
```

## Flow Description

### 1. Initial Setup
- User opens the Nexus Pay application
- System checks for wallet connection status
- If no wallet connected, prompts for MetaMask connection

### 2. Nexus SDK Initialization
- After wallet connection, checks Nexus SDK status
- If not initialized, provides "Connect Nexus" button
- Initializes SDK with event hooks and error handling

### 3. Balance Management
- Fetches PYUSD balances from all supported chains
- Aggregates total balance for unified view
- Displays chain-specific breakdown

### 4. Transfer Process
- User fills transfer form with recipient, amount, and destination
- Form validation ensures data integrity
- System determines transfer method (Nexus bridge vs direct transfer)

### 5. Cross-Chain Intent (Nexus Bridge)
- Creates cross-chain intent through Nexus SDK
- Shows intent modal with fees and routing details
- User approval triggers intent execution
- Real-time progress tracking with step updates

### 6. Direct Transfer (Same Chain)
- Handles chain switching if necessary
- Executes standard ERC-20 transfer
- Waits for blockchain confirmation

### 7. Error Handling
- Comprehensive error handling at each step
- User-friendly error messages
- Graceful fallback to main dashboard

### 8. Background Processes
- Automatic balance refreshing
- Event listeners for transaction updates
- Cache management for optimal performance
