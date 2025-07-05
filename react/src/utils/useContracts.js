import { ethers } from 'ethers';
import DecentralizedJournal from "../artifacts/contracts/DecentralizedJournal.sol/DecentralizedJournal.json";

const DECENTRALIZEDJOURNAL_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

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

  const getPapers = async (signer) => {
    try {
      const contract = await getDecentralizedJournalContract(signer);
      const numberOfPapers = await contract.getTotalPapers();
      console.log(numberOfPapers);
      const newPapers = [];
      for(let i = 0; i < numberOfPapers; i++){
        let paper = await contract.getPaper(i);
        paper = Array.from(paper);
        paper.push(Array.from(paper[5]));
        const formatPaper = {
          id: i + 1,
          title: paper[0],
          abstractText: paper[1],
          ipfsHash: paper[2],
          author: paper[3],
          timestamp: paper[4],
          keywords: paper[7],
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

  return {
    mintPaper,
    getPapers
  };
}