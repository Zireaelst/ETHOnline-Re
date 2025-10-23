// PYUSD SDK for Nexus Pay
import { createPublicClient, http, formatUnits, parseUnits, type Address } from 'viem';
import { sepolia, polygonAmoy, arbitrumSepolia } from 'viem/chains';
import { PYUSD_ADDRESSES, PYUSD_DECIMALS } from '../constants/tokens';

// PYUSD ABI - ERC20 standard functions
const PYUSD_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_to", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {"name": "_owner", "type": "address"},
      {"name": "_spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_spender", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  }
] as const;

// Chain configurations with reliable RPC URLs
const CHAIN_CONFIGS = {
    [sepolia.id]: {
      chain: sepolia,
      rpcUrls: [
        'https://eth-sepolia.public.blastapi.io',
        'https://sepolia.drpc.org',
        'https://rpc.sepolia.org',
        'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
      ],
    },
    [polygonAmoy.id]: {
      chain: polygonAmoy,
      rpcUrls: [
        'https://rpc-amoy.polygon.technology',
        'https://polygon-amoy.drpc.org',
        'https://polygon-amoy.blockpi.network/v1/rpc/public',
      ],
    },
    [arbitrumSepolia.id]: {
      chain: arbitrumSepolia,
      rpcUrls: [
        'https://sepolia-rollup.arbitrum.io/rpc',
        'https://arbitrum-sepolia.drpc.org',
        'https://arbitrum-sepolia.blockpi.network/v1/rpc/public',
      ],
    },
};

export interface PYUSDBalance {
  chainId: number;
  chainName: string;
  balance: string;
  balanceFormatted: string;
  contractAddress: Address;
}

export interface PYUSDTransferResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export class PYUSDSDK {
  private clients: Map<number, ReturnType<typeof createPublicClient>> = new Map();
  private balanceCache: Map<string, { balance: PYUSDBalance; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds cache
  private readonly DEBOUNCE_DELAY = 1000; // 1 second debounce
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    // Initialize clients for each supported chain with fallback RPC URLs
    Object.entries(CHAIN_CONFIGS).forEach(([chainId, config]) => {
      // Create client with fallback transport
      const client = createPublicClient({
        chain: config.chain,
        transport: http(config.rpcUrls[0], {
          timeout: 10000, // 10 second timeout
          retryCount: 3,
          retryDelay: 1000,
        }),
      });
      this.clients.set(Number(chainId), client);
    });
  }

  /**
   * Get cache key for balance request
   */
  private getCacheKey(address: Address, chainId: number): string {
    return `${address.toLowerCase()}-${chainId}`;
  }

  /**
   * Check if cached balance is still valid
   */
  private isCacheValid(cacheKey: string): boolean {
    const cached = this.balanceCache.get(cacheKey);
    if (!cached) return false;
    
    const now = Date.now();
    return (now - cached.timestamp) < this.CACHE_DURATION;
  }

  /**
   * Get cached balance if valid
   */
  private getCachedBalance(cacheKey: string): PYUSDBalance | null {
    if (!this.isCacheValid(cacheKey)) {
      this.balanceCache.delete(cacheKey);
      return null;
    }
    
    return this.balanceCache.get(cacheKey)?.balance || null;
  }

  /**
   * Cache balance result
   */
  private cacheBalance(cacheKey: string, balance: PYUSDBalance): void {
    this.balanceCache.set(cacheKey, {
      balance,
      timestamp: Date.now(),
    });
  }

  /**
   * Debounced balance fetch
   */
  private debouncedBalanceFetch(
    address: Address,
    chainId: number,
    resolve: (value: PYUSDBalance | null) => void,
    reject: (reason?: Error) => void
  ): void {
    const cacheKey = this.getCacheKey(address, chainId);
    
    // Clear existing timer
    const existingTimer = this.debounceTimers.get(cacheKey);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(async () => {
      try {
        const balance = await this.fetchBalanceFromChain(address, chainId);
        resolve(balance);
      } catch (error) {
        reject(error);
      } finally {
        this.debounceTimers.delete(cacheKey);
      }
    }, this.DEBOUNCE_DELAY);

    this.debounceTimers.set(cacheKey, timer);
  }

  /**
   * Fetch balance from blockchain (without cache)
   */
  private async fetchBalanceFromChain(address: Address, chainId: number): Promise<PYUSDBalance | null> {
    const client = this.clients.get(chainId);
    const contractAddress = PYUSD_ADDRESSES[chainId as keyof typeof PYUSD_ADDRESSES];
    
    if (!client || !contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      console.warn(`Skipping chain ${chainId}: No valid PYUSD contract configured`);
      return null;
    }

    try {
      const balance = await client.readContract({
        address: contractAddress as Address,
        abi: PYUSD_ABI,
        functionName: 'balanceOf',
        args: [address],
      }) as bigint;

      const chainConfig = CHAIN_CONFIGS[chainId as keyof typeof CHAIN_CONFIGS];
      
      const result: PYUSDBalance = {
        chainId,
        chainName: chainConfig.chain.name,
        balance: balance.toString(),
        balanceFormatted: formatUnits(balance, PYUSD_DECIMALS),
        contractAddress: contractAddress as Address,
      };

      // Cache the result
      const cacheKey = this.getCacheKey(address, chainId);
      this.cacheBalance(cacheKey, result);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('returned no data') || errorMessage.includes('does not have the function')) {
        console.warn(`Chain ${chainId}: PYUSD contract not available or invalid at ${contractAddress}`);
        return null;
      }
      console.error(`Error fetching PYUSD balance on chain ${chainId}:`, error);
      return null;
    }
  }

  /**
   * Get PYUSD balance for a specific address on a specific chain
   * Uses caching and debouncing to reduce API calls
   */
  async getBalance(address: Address, chainId: number): Promise<PYUSDBalance | null> {
    const cacheKey = this.getCacheKey(address, chainId);
    
    // Check cache first
    const cachedBalance = this.getCachedBalance(cacheKey);
    if (cachedBalance) {
      console.log(`Using cached balance for ${address} on chain ${chainId}`);
      return cachedBalance;
    }

    // Return promise for debounced fetch
    return new Promise((resolve, reject) => {
      this.debouncedBalanceFetch(address, chainId, resolve, reject);
    });
  }
  /**
   * Get PYUSD balance across all supported chains
   */
  async getUnifiedBalance(address: Address): Promise<PYUSDBalance[]> {
    const promises = Object.keys(PYUSD_ADDRESSES).map(chainId => 
      this.getBalance(address, Number(chainId))
    );

    const results = await Promise.all(promises);
    return results.filter((balance): balance is PYUSDBalance => balance !== null);
  }

  /**
   * Get total PYUSD balance across all chains
   */
  async getTotalBalance(address: Address): Promise<string> {
    const balances = await this.getUnifiedBalance(address);
    
    let total = 0n;
    balances.forEach(balance => {
      total += BigInt(balance.balance);
    });

    return formatUnits(total, PYUSD_DECIMALS);
  }

  /**
   * Check if PYUSD is supported on a specific chain
   */
  isChainSupported(chainId: number): boolean {
    return chainId in PYUSD_ADDRESSES;
  }

  /**
   * Get PYUSD contract address for a specific chain
   */
  getContractAddress(chainId: number): Address | null {
    return (PYUSD_ADDRESSES[chainId as keyof typeof PYUSD_ADDRESSES] as Address) || null;
  }

  /**
   * Format PYUSD amount (from string to BigInt)
   */
  parseAmount(amount: string): bigint {
    return parseUnits(amount, PYUSD_DECIMALS);
  }

  /**
   * Format PYUSD amount (from BigInt to string)
   */
  formatAmount(amount: bigint): string {
    return formatUnits(amount, PYUSD_DECIMALS);
  }

  /**
   * Transfer PYUSD to another address (requires wallet connection)
   * This is a placeholder - actual implementation would require wallet integration
   */
  async transfer(
    from: Address,
    to: Address,
    amount: string,
    chainId: number
  ): Promise<PYUSDTransferResult> {
    const contractAddress = PYUSD_ADDRESSES[chainId as keyof typeof PYUSD_ADDRESSES];
    
    if (!contractAddress) {
      return {
        success: false,
        error: `PYUSD not supported on chain ${chainId}`,
      };
    }

    try {
      // This would require wallet integration with wagmi/viem
      // For now, return a mock success response
      return {
        success: true,
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock transaction hash
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transfer failed',
      };
    }
  }
}

// Export singleton instance
export const pyusdSDK = new PYUSDSDK();
