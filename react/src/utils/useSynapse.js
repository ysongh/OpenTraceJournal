import { Synapse, RPC_URLS, TOKENS, TIME_CONSTANTS, CONTRACT_ADDRESSES } from "@filoz/synapse-sdk";
import { ethers } from 'ethers';

export const useSynapse = () => {
  const initializeSynapse = async () => {
    const synapse = await Synapse.create({
      privateKey: import.meta.env.VITE_PRIVATE_KEY,
      rpcURL: RPC_URLS.calibration.http,
    })
    return synapse;
  }

  const depositAndApproveUSDF = async () => {
    const synapse = await initializeSynapse();
    console.log(synapse);

    const depositAmount = ethers.parseUnits("2.5", 18);
    const tx = await synapse.payments.depositWithPermitAndApproveOperator(
      depositAmount, // 2.5 USDFC (covers 1TiB of storage for 30 days)
      synapse.getWarmStorageAddress(),
      ethers.MaxUint256,
      ethers.MaxUint256,
      TIME_CONSTANTS.EPOCHS_PER_MONTH,
    );
    await tx.wait();
    console.log(`✅ USDFC deposit and Warm Storage service approval successful!`);
  };
 
  const depositUSDF = async (provider) => {
    const synapse = await initializeSynapse();

    // Deposit USDFC tokens (one-time setup)
    const amount = ethers.parseUnits('10', 18);  // 10 USDFC
    await synapse.payments.deposit(amount, TOKENS.USDFC);
  };

  // Approve the Pandora service for automated payments
  const approveUSDF  = async (provider) => {
     const synapse = await initializeSynapse();

    const warmStorageAddress = synapse.getWarmStorageAddress()
    await synapse.payments.approveService(
      warmStorageAddress,
      ethers.parseUnits('10', 18),   // Rate allowance: 10 USDFC per epoch
      ethers.parseUnits('1000', 18),  // Lockup allowance: 1000 USDFC total
      86400n
    );
  };
  
  return {
    initializeSynapse,
    depositAndApproveUSDF,
    depositUSDF,
    approveUSDF
  };

}