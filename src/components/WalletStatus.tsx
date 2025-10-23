"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface EthereumProvider {
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isWalletConnect?: boolean;
  isTrust?: boolean;
  isBraveWallet?: boolean;
}

interface WindowWithWallets extends Window {
  ethereum?: EthereumProvider;
  petra?: object;
}

export const WalletStatus = () => {
  const [walletConflicts, setWalletConflicts] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkWalletProviders = () => {
      const conflicts: string[] = [];
      
      // Check for multiple ethereum providers
      if (typeof window !== 'undefined') {
        const windowWithWallets = window as WindowWithWallets;
        const ethereum = windowWithWallets.ethereum;
        
        if (ethereum) {
          // Check for MetaMask
          if (ethereum.isMetaMask) conflicts.push('MetaMask');
          
          // Check for other wallets
          if (ethereum.isCoinbaseWallet) conflicts.push('Coinbase Wallet');
          if (ethereum.isWalletConnect) conflicts.push('WalletConnect');
          if (ethereum.isTrust) conflicts.push('Trust Wallet');
          if (ethereum.isBraveWallet) conflicts.push('Brave Wallet');
          
          // Check for Petra (mentioned in console)
          if (windowWithWallets.petra) conflicts.push('Petra Wallet');
        }
      }
      
      setWalletConflicts(conflicts);
      setIsChecking(false);
    };

    // Check after a short delay to ensure all extensions are loaded
    const timer = setTimeout(checkWalletProviders, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return null;
  }

  if (walletConflicts.length > 1) {
    return (
      <Alert className="mb-4 border-yellow-600/50 bg-yellow-50/80">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Multiple Wallet Extensions Detected:</strong> {walletConflicts.join(', ')}
          <br />
          <span className="text-sm">
            This may cause provider conflicts. Consider disabling unused wallet extensions or use only one wallet at a time.
          </span>
        </AlertDescription>
      </Alert>
    );
  }

  if (walletConflicts.length === 1) {
    return (
      <Alert className="mb-4 border-[#5EEAD4]/50 bg-[#5EEAD4]/20">
        <CheckCircle className="h-4 w-4 text-[#2E2A47]" />
        <AlertDescription className="text-[#2E2A47]">
          <strong>Wallet Detected:</strong> {walletConflicts[0]} is ready to use.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-red-400/50 bg-red-50/80">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <strong>No Wallet Detected:</strong> Please install a wallet extension like MetaMask to continue.
      </AlertDescription>
    </Alert>
  );
};
