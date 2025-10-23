"use client";

import { DollarSign, TrendingUp, Wallet, RefreshCw } from "lucide-react";

interface BalanceSummaryProps {
  totalBalance: string;
  chainCount: number;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const BalanceSummary = ({ 
  totalBalance, 
  chainCount, 
  isLoading = false,
  onRefresh 
}: BalanceSummaryProps) => {
  const hasBalance = parseFloat(totalBalance) > 0;

  return (
    <div className="bg-white/30 backdrop-blur-sm rounded-2xl border border-[#B79CED]/30 p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#2E2A47] flex items-center gap-2">
          <Wallet className="w-6 h-6 text-[#8B5CF6]" />
          PYUSD Portfolio
        </h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg bg-[#B79CED]/20 hover:bg-[#B79CED]/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-[#2E2A47] ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Balance */}
        <div className="text-center md:text-left">
          <p className="text-[#2E2A47]/70 text-sm font-medium mb-1">Total Balance</p>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <DollarSign className="w-8 h-8 text-[#5EEAD4]" />
            <span className="text-4xl font-bold text-[#2E2A47]">
              {totalBalance}
            </span>
            <span className="text-xl text-[#2E2A47]/80 font-medium">PYUSD</span>
          </div>
          {hasBalance && (
            <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
              <div className="w-2 h-2 bg-[#5EEAD4] rounded-full animate-pulse"></div>
              <span className="text-[#5EEAD4] text-sm font-medium">Live Balance</span>
            </div>
          )}
        </div>

        {/* Chain Info */}
        <div className="text-center md:text-right">
          <p className="text-[#2E2A47]/70 text-sm font-medium mb-1">Active Chains</p>
          <div className="flex items-center justify-center md:justify-end gap-2">
            <TrendingUp className="w-6 h-6 text-[#8B5CF6]" />
            <span className="text-3xl font-bold text-[#2E2A47]">{chainCount}</span>
            <span className="text-lg text-[#2E2A47]/80">chain{chainCount !== 1 ? 's' : ''}</span>
          </div>
          <p className="text-[#8B5CF6] text-sm mt-2 font-medium">
            {hasBalance ? 'PYUSD Available' : 'No Balance Found'}
          </p>
        </div>
      </div>

      {hasBalance && (
        <div className="mt-4 p-3 bg-[#5EEAD4]/20 border border-[#5EEAD4]/40 rounded-lg">
          <p className="text-[#2E2A47] text-sm font-medium">
            ✨ Ready to send PYUSD across {chainCount} testnet{chainCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};
