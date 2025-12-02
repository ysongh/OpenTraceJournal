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

  const uploadText = async (text) => {
    const synapse = await initializeSynapse();

    const data = new TextEncoder().encode(text);
    const { pieceCid, size } = await synapse.storage.upload(data);
    console.log(`✅ Upload complete!`);
    console.log(`PieceCID: ${pieceCid}`);
    console.log(`Size: ${size} bytes`);

    return pieceCid;
  }

  const downloadText = async (pieceCid) => {
    const synapse = await initializeSynapse();

    const bytes = await synapse.storage.download(pieceCid);
    const decodedText = new TextDecoder().decode(bytes);
    console.log(`✅ Download successful!`);
    console.log(`Downloaded data: ${decodedText}\n`);
    console.log("🎉 Data storage and retrieval successful!");
  }
  
  return {
    initializeSynapse,
    depositAndApproveUSDF,
    uploadText,
    downloadText
  };

}