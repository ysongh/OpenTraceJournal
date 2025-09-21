import { Synapse, TOKENS, CONTRACT_ADDRESSES } from "@filoz/synapse-sdk";
import { ethers } from 'ethers';

export const useSynapse = () => {
  const depositUSDF = async (provider) => {
    const synapse = await Synapse.create({ provider });

    // Deposit USDFC tokens (one-time setup)
    const amount = ethers.parseUnits('10', 18);  // 10 USDFC
    await synapse.payments.deposit(amount, TOKENS.USDFC);
  };

  // Approve the Pandora service for automated payments
  const approveUSDF  = async (provider) => {
    const synapse = await Synapse.create({ provider });

    const warmStorageAddress = synapse.getWarmStorageAddress()
    await synapse.payments.approveService(
      warmStorageAddress,
      ethers.parseUnits('10', 18),   // Rate allowance: 10 USDFC per epoch
      ethers.parseUnits('1000', 18),  // Lockup allowance: 1000 USDFC total
      86400n
    );
  };
  
  return {
    depositUSDF,
    approveUSDF
  };

}