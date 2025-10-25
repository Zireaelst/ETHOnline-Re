"use client";

import { PYUSD_ADDRESSES } from "@/constants/tokens";
import { parseUnits, type Address } from "viem";
import { writeContract, waitForTransactionReceipt } from "wagmi/actions";
import type { Config } from "wagmi";

// PYUSD contract ABI (ERC20 standard)
const PYUSD_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }]
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }]
  }
] as const;

export interface TransferParams {
  recipient: Address;
  amount: string;
  chainId: number;
}

export interface TransferResult {
  success: boolean;
  transactionHash?: string;
  explorerUrl?: string;
  error?: string;
}

export class PYUSDTransferService {
  private static getExplorerUrl(chainId: number, txHash: string): string {
    const explorers: Record<number, string> = {
      11155111: "https://sepolia.etherscan.io/tx/", // Ethereum Sepolia
      421614: "https://sepolia.arbiscan.io/tx/", // Arbitrum Sepolia
      80002: "https://amoy.polygonscan.com/tx/", // Polygon Amoy
    };
    
    return `${explorers[chainId] || ""}${txHash}`;
  }

  static async transferPYUSD(
    config: Config,
    params: TransferParams
  ): Promise<TransferResult> {
    try {
      const { recipient, amount, chainId } = params;
      
      // Get PYUSD contract address for the chain
      const contractAddress = PYUSD_ADDRESSES[chainId as keyof typeof PYUSD_ADDRESSES];
      
      if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error(`PYUSD not supported on chain ${chainId}`);
      }

      // Convert amount to wei (PYUSD has 6 decimals)
      const amountInWei = parseUnits(amount, 6);

      console.log(`Transferring ${amount} PYUSD to ${recipient} on chain ${chainId}`);
      console.log(`Contract: ${contractAddress}, Amount in wei: ${amountInWei}`);

      // Execute the transfer
      const hash = await writeContract(config, {
        address: contractAddress as Address,
        abi: PYUSD_ABI,
        functionName: "transfer",
        args: [recipient, amountInWei],
        chainId,
      });

      console.log(`Transaction submitted: ${hash}`);

      // Wait for transaction confirmation
      const receipt = await waitForTransactionReceipt(config, {
        hash,
        chainId,
        confirmations: 1,
      });

      console.log(`Transaction confirmed: ${receipt.transactionHash}`);

      const explorerUrl = this.getExplorerUrl(chainId, receipt.transactionHash);

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        explorerUrl,
      };

    } catch (error: unknown) {
      console.error("PYUSD transfer failed:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown transfer error";
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  static isChainSupported(chainId: number): boolean {
    const contractAddress = PYUSD_ADDRESSES[chainId as keyof typeof PYUSD_ADDRESSES];
    return contractAddress !== undefined && contractAddress !== '0x0000000000000000000000000000000000000000';
  }

  static getSupportedChains(): number[] {
    return Object.entries(PYUSD_ADDRESSES)
      .filter(([, address]) => address !== '0x0000000000000000000000000000000000000000')
      .map(([chainId]) => parseInt(chainId));
  }
}
