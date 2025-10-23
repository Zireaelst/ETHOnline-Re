"use client";

import { CheckCircle, AlertCircle, Clock } from "lucide-react";

interface DebugStatsProps {
  chainStats: Array<{
    chainId: number;
    chainName: string;
    status: 'success' | 'error' | 'skipped';
    balance?: string;
    message?: string;
  }>;
  totalBalance: string;
  lastUpdated?: Date;
}

export const DebugStats = ({ chainStats, totalBalance, lastUpdated }: DebugStatsProps) => {
  const successCount = chainStats.filter(s => s.status === 'success').length;

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          Debug Information
        </h3>
        {lastUpdated && (
          <span className="text-slate-400 text-xs">
            {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-sm text-green-300">
          ✅ Found {successCount} chain{successCount !== 1 ? 's' : ''} with PYUSD, total: {totalBalance} PYUSD
        </div>
        
        {chainStats.map((stat) => (
          <div key={stat.chainId} className="flex items-center gap-2 text-xs">
            {stat.status === 'success' && <CheckCircle className="w-3 h-3 text-green-400" />}
            {stat.status === 'error' && <AlertCircle className="w-3 h-3 text-red-400" />}
            {stat.status === 'skipped' && <AlertCircle className="w-3 h-3 text-yellow-400" />}
            
            <span className="text-slate-300">
              {stat.chainName} ({stat.chainId}):
            </span>
            
            {stat.status === 'success' && (
              <span className="text-green-300">{stat.balance} PYUSD</span>
            )}
            {stat.status === 'skipped' && (
              <span className="text-yellow-300">Skipped - {stat.message}</span>
            )}
            {stat.status === 'error' && (
              <span className="text-red-300">Error - {stat.message}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
