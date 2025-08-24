import { Blocklock, encodeCiphertextToSolidity, encodeCondition, encodeParams } from "blocklock-js";
import { Wallet, NonceManager, ethers, getBytes } from "ethers";
import DecentralizedJournal from "../artifacts/contracts/DecentralizedJournal.sol/DecentralizedJournal.json";
import MockBlocklockReceiver from "../artifacts/contracts/MockBlocklockReceiver.sol/MockBlocklockReceiver.json";

const DECENTRALIZEDJOURNAL_ADDRESS =  import.meta.env.VITE_CONTRACT_ADDRESS;
const MOCKBLOCKLOCKRECEIVER_ADDRESS =  import.meta.env.VITE_CONTRACT_ADDRESS1;

export const useContracts = () => {
  const getDecentralizedJournalContract = async (signer) => {
    return new ethers.Contract(DECENTRALIZEDJOURNAL_ADDRESS, DecentralizedJournal.abi, signer);
  };

  const getMockBlocklockReceiverContract = async (signer) => {
    return new ethers.Contract(MOCKBLOCKLOCKRECEIVER_ADDRESS, MockBlocklockReceiver.abi, signer);
  };

  const mintPaper = async (signer, title, abstractText, ipfsHash, keywords, field, tokenURI) => {
    const contract = await getDecentralizedJournalContract(signer);
    const createTX = await contract.mintPaper(title, abstractText, ipfsHash, keywords, field, tokenURI);
    await createTX.wait();
    return createTX;
  }

  const payCitation = async (signer, id, citerTitle, citerAuthorName) => {
    const contract = await getDecentralizedJournalContract(signer);
    const createTX = await contract.payCitation(id - 1, citerTitle, citerAuthorName, { value: ethers.parseEther("0.01") });
    await createTX.wait();
    return createTX;
  }

  const setCitationPrice = async (signer, id, amount) => {
    const contract = await getDecentralizedJournalContract(signer);
    const createTX = await contract.setCitationPrice(id - 1, ethers.parseEther(amount.toString()));
    await createTX.wait();
    return createTX;
  }

  const encryptData = async (provider, signer) => {
    try {
      const contract = await getMockBlocklockReceiverContract(signer);

      const blockHeight = BigInt(await provider.getBlockNumber() + 10);
      const conditionBytes = encodeCondition(blockHeight);

      // Set the message to encrypt
      const msg = ethers.parseEther("8"); // Example: BigInt for blocklock ETH transfer
      const msgBytes = encodeParams(["uint256"], [msg]);
      const encodedMessage = getBytes(msgBytes);

      // Encrypt the encoded message usng Blocklock.js library
      const blocklockjs = Blocklock.createFilecoinCalibnet(signer);
      const cipherMessage = blocklockjs.encrypt(encodedMessage, blockHeight);

      // Set the callback gas limit and price
      // Best practice is to estimate the callback gas limit e.g., by extracting gas reports from Solidity tests
      const callbackGasLimit = 700_000n;
      // Based on the callbackGasLimit, we can estimate the request price by calling BlocklockSender
      // Note: Add a buffer to the estimated request price to cover for fluctuating gas prices between blocks
      const [requestCallBackPrice] = await blocklockjs.calculateRequestPriceNative(callbackGasLimit)

      console.log("Target block for unlock:", blockHeight);
      console.log("Callback gas limit:", callbackGasLimit);
      console.log("Request CallBack price:", ethers.formatEther(requestCallBackPrice), "ETH");
      
      //Ensure wallet has enought token to cover the callback fee
      const balance = await provider.getBalance(signer.address);
      console.log("Wallet balance:", ethers.formatEther(balance), "ETH");
      if (balance < requestCallBackPrice) {
          throw new Error(`Insufficient balance. Need ${ethers.formatEther(requestCallBackPrice)} ETH but have ${ethers.formatEther(balance)} ETH`);
      }

      // 3. Invoke myBlocklockReceiver contract to request blocklock encryption with direct funding.
      console.log("Sending transaction...");
      const tx = await contract.createTimelockRequestWithDirectFunding(
          callbackGasLimit,
          conditionBytes,
          encodeCiphertextToSolidity(cipherMessage),
          { value: requestCallBackPrice }
      );
      
      console.log("Transaction sent, waiting for confirmation...");
      const receipt = await tx.wait(1);
      if (!receipt) {
          throw new Error("Transaction failed");
      }
      console.log("BlockLock requested in tx:", receipt.hash);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  const getPapers = async (signer) => {
    try {
      const contract = await getDecentralizedJournalContract(signer);
      const numberOfPapers = await contract.getTotalPapers();
      console.log(numberOfPapers);
      const newPapers = [];
      for(let i = 0; i < numberOfPapers; i++){
        let paper = await contract.getPaper(i);
        paper = Array.from(paper);
        console.log(paper);
        paper.push(Array.from(paper[5]));
        const formatPaper = {
          id: i + 1,
          title: paper[0],
          abstractText: paper[1],
          ipfsHash: paper[2],
          author: paper[3],
          timestamp: paper[4],
          keywords: paper[9],
          field: paper[6],
        }
        newPapers.push(formatPaper);
      }
      console.log(newPapers);
      return newPapers;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  const getPaperById = async (signer, id) => {
    try {
      const contract = await getDecentralizedJournalContract(signer);
      let paper = await contract.getPaper(id - 1);
      paper = Array.from(paper);
      paper.push(Array.from(paper[5]));
      const formatPaper = {
        id: id,
        title: paper[0],
        abstractText: paper[1],
        ipfsHash: paper[2],
        author: paper[3],
        timestamp: paper[4],
        keywords: paper[9],
        field: paper[6],
        totalEarnings: paper[8],
      }
      console.log(formatPaper);
      return formatPaper;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  const getPaperCitations = async (signer, id) => {
    try {
      const contract = await getDecentralizedJournalContract(signer);
      let ids = await contract.getPaperCitations(id - 1);
      ids = Array.from(ids);

      const citations = [];
      for(let i = 0; i < ids.length; i++){
        let citation = await contract.getCitation(i);
        citation = Array.from(citation);
        console.log(citation);
        const formatCitation = {
          id: i + 1,
          title: citation[3],
          author: citation[4],
          timestamp: citation[6],
        }
        citations.push(formatCitation);
      }

      console.log(citations);
      return citations;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  return {
    mintPaper,
    payCitation,
    setCitationPrice,
    encryptData,
    getPapers,
    getPaperById,
    getPaperCitations
  };
}