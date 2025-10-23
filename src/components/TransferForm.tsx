"use client";

import React, { useState } from "react";
import { isAddress } from "viem";
import { Send, Loader2, AlertCircle } from "lucide-react";
import { SUPPORTED_DESTINATION_CHAINS } from "@/constants/chains";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TransferFormProps {
  onTransfer?: (data: { recipient: string; amount: string; destinationChain: number }) => Promise<void>;
}

const TransferForm = ({ onTransfer }: TransferFormProps) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [destinationChain, setDestinationChain] = useState(SUPPORTED_DESTINATION_CHAINS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isFormValid = isAddress(recipient) && parseFloat(amount) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setError("Please enter a valid address and amount");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      // Call the transfer function passed from parent
      if (onTransfer) {
        await onTransfer({
          recipient,
          amount,
          destinationChain,
        });
      }
      
      // Clear form on success
      setRecipient("");
      setAmount("");
    } catch (error) {
      console.error("Transfer error:", error);
      setError("Transfer failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
      <div className="text-center mb-6">
        <Send className="w-8 h-8 mx-auto mb-3 text-white" />
        <h3 className="text-xl font-semibold text-white mb-2">Send PYUSD</h3>
        <p className="text-white/80 text-sm">Transfer across all supported chains</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Address */}
        <div className="space-y-2">
          <Label htmlFor="recipient" className="text-white/90">
            Recipient Address
          </Label>
          <Input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value);
              setError("");
            }}
            placeholder="0x..."
            className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-white/90">
            Amount (PYUSD)
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.000001"
            min="0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            placeholder="10.00"
            className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        {/* Destination Chain */}
        <div className="space-y-2">
          <Label htmlFor="destination" className="text-white/90">
            Destination Chain
          </Label>
          <Select
            value={destinationChain.toString()}
            onValueChange={(value) => setDestinationChain(Number(value))}
          >
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SelectValue placeholder="Select destination chain" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              {SUPPORTED_DESTINATION_CHAINS.map((chain) => (
                <SelectItem 
                  key={chain.id} 
                  value={chain.id.toString()}
                  className="text-white hover:bg-gray-800"
                >
                  {chain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send PYUSD
            </>
          )}
        </Button>
      </form>

              {/* Info */}
              <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-xs">
                  💡 Nexus will automatically find PYUSD on any chain and bridge it to your destination
                </p>
              </div>
    </div>
  );
};

export default TransferForm;
