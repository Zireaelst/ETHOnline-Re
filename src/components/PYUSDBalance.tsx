"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import { pyusdSDK, type PYUSDBalance } from "@/lib/pyusd-sdk";
import { BalanceSummary } from "./BalanceSummary";

const PYUSDBalanceComponent = () => {
  const [pyusdBalances, setPyusdBalances] = useState<PYUSDBalance[]>([]);
  const [totalBalance, setTotalBalance] = useState<string>("0.00");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const { address } = useAccount();

  const fetchPYUSDBalances = useCallback(async () => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Fetching PYUSD balances for ${address}...`);
      const balances = await pyusdSDK.getUnifiedBalance(address);
      const total = await pyusdSDK.getTotalBalance(address);
      
      const nonZeroBalances = balances.filter(b => parseFloat(b.balanceFormatted) > 0);
      console.log(`Found ${nonZeroBalances.length} chains with PYUSD, total: ${total} PYUSD`);
      
      // Log detailed chain information
      nonZeroBalances.forEach(balance => {
        console.log(`- ${balance.chainName} (${balance.chainId}): ${balance.balanceFormatted} PYUSD`);
      });
      
      setPyusdBalances(balances);
      setTotalBalance(total);
      setLastFetchTime(new Date());
    } catch (error) {
      console.error("Error fetching PYUSD balances:", error);
      setError("Failed to fetch PYUSD balances. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchPYUSDBalances();
    }
  }, [address, fetchPYUSDBalances]);

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-center bg-white/40 backdrop-blur-sm rounded-xl border border-[#B79CED]/30">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#8B5CF6]" />
        <p className="text-[#2E2A47]/80">Loading PYUSD Balance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-center bg-red-50/80 backdrop-blur-sm rounded-xl border border-red-300/40">
        <p className="text-red-700 mb-4">{error}</p>
        <button 
          onClick={fetchPYUSDBalances}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-center bg-white/40 backdrop-blur-sm rounded-xl border border-[#B79CED]/30">
        <Wallet className="w-12 h-12 mx-auto mb-4 text-[#8B5CF6]" />
        <h3 className="text-xl font-semibold text-[#2E2A47] mb-2">Connect Wallet</h3>
        <p className="text-[#2E2A47]/80">Connect your wallet to view PYUSD balance</p>
      </div>
    );
  }

  if (pyusdBalances.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-center bg-white/40 backdrop-blur-sm rounded-xl border border-[#B79CED]/30">
        <Wallet className="w-12 h-12 mx-auto mb-4 text-[#8B5CF6]" />
        <h3 className="text-xl font-semibold text-[#2E2A47] mb-2">No PYUSD Found</h3>
        <p className="text-[#2E2A47]/80">Get some test PYUSD to start using Nexus Pay</p>
        <p className="text-[#2E2A47]/60 text-sm mt-2">
          Contract addresses are configured for testnets
        </p>
      </div>
    );
  }

  const nonZeroBalances = pyusdBalances.filter(b => parseFloat(b.balanceFormatted) > 0);
  const hasBalances = parseFloat(totalBalance) > 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Balance Summary */}
      <BalanceSummary 
        totalBalance={totalBalance}
        chainCount={nonZeroBalances.length}
        isLoading={isLoading}
        onRefresh={fetchPYUSDBalances}
      />

      {/* Detailed Chain Information */}
      <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-[#B79CED]/30 p-6">
        {lastFetchTime && (
          <div className="text-center mb-4">
            <p className="text-[#2E2A47]/60 text-xs">
              Last updated: {lastFetchTime.toLocaleTimeString()}
            </p>
          </div>
        )}

        {/* Chain Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-[#2E2A47]/80">Balance by Chain:</h4>
            <button 
              onClick={fetchPYUSDBalances}
              className="text-xs text-[#8B5CF6] hover:text-[#8B5CF6]/80 underline"
            >
              Refresh
            </button>
          </div>
          {pyusdBalances.map((balance) => {
            const hasBalance = parseFloat(balance.balanceFormatted) > 0;
            return (
              <div 
                key={balance.chainId} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  hasBalance 
                    ? 'bg-[#5EEAD4]/20 border-[#5EEAD4]/40' 
                    : 'bg-white/20 border-[#B79CED]/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    hasBalance ? 'bg-[#5EEAD4]/40' : 'bg-[#B79CED]/30'
                  }`}>
                    <span className="text-xs font-bold text-[#2E2A47]">
                      {balance.chainName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-[#2E2A47]/90 font-medium">{balance.chainName}</span>
                    <p className="text-xs text-[#2E2A47]/60">Chain ID: {balance.chainId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${hasBalance ? 'text-[#2E2A47]' : 'text-[#2E2A47]/60'}`}>
                    {balance.balanceFormatted} PYUSD
                  </p>
                  {hasBalance && (
                    <p className="text-xs text-[#5EEAD4] font-medium">
                      Available ✓
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

        {/* Status Summary */}
        {hasBalances && (
          <div className="mt-4 p-3 bg-[#5EEAD4]/20 border border-[#5EEAD4]/40 rounded-lg">
            <p className="text-[#2E2A47] text-sm font-medium mb-2">
              ✅ PYUSD Balance Summary
            </p>
            <p className="text-[#2E2A47]/80 text-sm">
              Found {nonZeroBalances.length} chain{nonZeroBalances.length > 1 ? 's' : ''} with PYUSD, total: {totalBalance} PYUSD
            </p>
            <div className="text-xs text-[#2E2A47]/70 mt-2 space-y-1">
              {nonZeroBalances.map(balance => (
                <div key={balance.chainId}>
                  • {balance.chainName} (Chain {balance.chainId}): {balance.balanceFormatted} PYUSD
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contract Info */}
        <div className="mt-4 p-3 bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 rounded-lg">
          <p className="text-[#2E2A47] text-xs mb-2 font-medium">
            🔗 PYUSD Testnet Contract Addresses:
          </p>
          <div className="text-xs text-[#2E2A47]/70 space-y-1">
            <div>Sepolia: 0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9</div>
            <div>Polygon Amoy: 0x6c3ea9036406852006290770BEdFcAbA0e23A0e8</div>
            <div>Arbitrum Sepolia: 0x637A1259C6afd7E3AdF63993cA7E58BB438aB1B1</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PYUSDBalanceComponent;
