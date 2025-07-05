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
        newPapers.push(paper);
      }
      console.log(newPapers);
    } catch (err) {
      console.error(err);
    }
  }

  return {
    mintPaper,
    getPapers
  };
}