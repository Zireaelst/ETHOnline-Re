"use client";

import ConnectWallet from "@/components/blocks/connect-wallet";
import Nexus from "@/components/nexus";
import NexusInitButton from "@/components/nexus-init";
import PYUSDBalanceComponent from "@/components/PYUSDBalance";
import TransferForm from "@/components/TransferForm";
import { WalletStatus } from "@/components/WalletStatus";
import { pyusdSDK } from "@/lib/pyusd-sdk";
import { useNexus } from "@/providers/NexusProvider";

export default function Home() {
  const { nexusSDK } = useNexus();

  const handleTransfer = async (data: { recipient: string; amount: string; destinationChain: number }) => {
    if (!nexusSDK) {
      throw new Error("Nexus SDK not initialized");
    }

    try {
      // Check if PYUSD is supported on the destination chain
      if (!pyusdSDK.isChainSupported(data.destinationChain)) {
        throw new Error(`PYUSD not supported on chain ${data.destinationChain}`);
      }

      // For now, use Nexus SDK with USDC as PYUSD is not yet supported
      // In production, this would be replaced with direct PYUSD transfer
      const bridgeResult = await nexusSDK.bridge({
        token: "USDC", // Using USDC as PYUSD alternative for demo
        amount: data.amount,
        chainId: data.destinationChain as 11155111 | 80002 | 421614, // Cast to supported chain ID
      });

      if (bridgeResult?.success) {
        console.log("Transfer successful:", bridgeResult);
        alert(`PYUSD Transfer successful! Explorer: ${bridgeResult.explorerUrl}`);
      } else {
        throw new Error("Transfer failed");
      }
    } catch (error) {
      console.error("Transfer error:", error);
      throw error;
    }
  };

  return (
    <div className="font-sans flex flex-col items-center justify-items-center min-h-screen p-4 pb-20 gap-y-6 sm:p-8">
      {/* Header Section */}
      <div className="text-center space-y-4 z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#2E2A47]">
          Nexus Pay
        </h1>
        <h2 className="text-lg sm:text-xl text-[#2E2A47]/80 font-medium">
          Unified PYUSD Wallet - Send Across All Chains
        </h2>
        <p className="text-[#2E2A47]/70 text-sm max-w-2xl mx-auto">
          Manage your PYUSD balances across multiple testnets with a single interface. 
          Connect your wallet and initialize Nexus to get started.
        </p>
      </div>

      {/* Wallet Status */}
      <div className="w-full max-w-4xl mx-auto z-10">
        <WalletStatus />
      </div>

      {/* Connection Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center z-10">
        <ConnectWallet />
        <NexusInitButton />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto z-10 space-y-6">
        {/* Always show PYUSD Balance - even before Nexus initialization */}
        <PYUSDBalanceComponent />
        
        {nexusSDK?.isInitialized() && (
          <>
            <TransferForm onTransfer={handleTransfer} />
            <Nexus />
          </>
        )}
      </div>
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, #F4F1FB 0%, #B79CED 50%, #8B5CF6 100%)`,
          backgroundSize: "100% 100%",
        }}
      />
    </div>
  );
}
