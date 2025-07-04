import { useContext, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import lighthouse from '@lighthouse-web3/sdk';

import { ETHContext } from '../ETHContext';
import { useContracts } from '../utils/useContracts';

function CreateKey() {
  const { signer, walletAddress } = useContext(ETHContext);

  const [apikey, setapikey] = useState('');

  const signAuthMessage = async(signer, verificationMessage) =>{
    const signedMessage = await signer.signMessage(verificationMessage)
    return(signedMessage)
  }
  
  const getApiKey = async() =>{
    const verificationMessage = (
      await axios.get(
          `https://api.lighthouse.storage/api/auth/get_message?publicKey=${walletAddress}`
      )
    ).data;
    const signedMessage = await signAuthMessage(signer, verificationMessage);
    const response = await lighthouse.getApiKey(walletAddress, signedMessage);
    console.log(response);
    setapikey(response.data.apiKey);
  }
  return (
    <div>
      <button onClick={getApiKey}>
        Get Api Key
      </button>
      <p>{apikey}</p>
    </div>
  )
}

export default CreateKey;