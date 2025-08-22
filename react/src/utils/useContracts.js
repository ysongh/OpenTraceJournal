import { Blocklock, encodeCiphertextToSolidity, encodeCondition } from "blocklock-js";
import { Wallet, NonceManager, ethers, getBytes } from "ethers";
import DecentralizedJournal from "../artifacts/contracts/DecentralizedJournal.sol/DecentralizedJournal.json";

const DECENTRALIZEDJOURNAL_ADDRESS =  import.meta.env.VITE_CONTRACT_ADDRESS;

export const useContracts = () => {
  const getDecentralizedJournalContract = async (signer) => {
    return new ethers.Contract(DECENTRALIZEDJOURNAL_ADDRESS, DecentralizedJournal.abi, signer);
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
      const blocklock = Blocklock.createFilecoinMainnet(signer);
      console.log("blocklock", blocklock);

      const msg = "It working"
      const plaintext = Buffer.from(msg);
      const currentBlock = await provider.getBlockNumber();
      const targetBlock = BigInt(currentBlock + 5);

      console.log(`Encrypting for block ${targetBlock} (current: ${currentBlock})`);
      const ciphertext = await blocklock.encrypt(plaintext, targetBlock);
      console.log("ciphertext", ciphertext);
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