import lighthouse from '@lighthouse-web3/sdk';
import { ethers } from 'ethers';
import { useState } from 'react';

const API_KEY = '8a415179-7ab8-47b8-83e8-d1b3975740fe'
// const cid = "QmQT3e1Uce8gA57jvoamCUuA6otSTb6L5v2SCqsxscEtJK"

const NewPoduct = () => {
  const [ cid, setCid ] = useState('')
  const encryptionSignature = async() =>{
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data.message;
    const signedMessage = await signer.signMessage(messageRequested);
    return({
      signedMessage: signedMessage,
      publicKey: address
    });
  }

  const applyAccessConditions = async() =>{
    // Conditions to add
    const conditions = [
      {
        id: 1,
        chain: "Hyperspace",
        method: "balanceOf",
        standardContractType: "ERC721",
        contractAddress: "0x1a6ceedD39E85668c233a061DBB83125847B8e3A",
        returnValueTest: { comparator: ">=", value: "1" },
        parameters: [":userAddress"],
    }
    ];

    const aggregator = "([1])";
    const { publicKey, signedMessage } = await encryptionSignature();

    const response = await lighthouse.accessCondition(
      publicKey,
      cid,
      signedMessage,
      conditions,
      aggregator
    );
    console.log(response);
  }

  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };

  const deployEncrypted = async(e) =>{
    const sig = await encryptionSignature();
    const response = await lighthouse.uploadEncrypted(
      e,
      sig.publicKey,
      API_KEY,
      sig.signedMessage,
      progressCallback
    );
    console.log(response);
    setCid(response.data.Hash)
  }

  return (
    <div className="App">
      <input onChange={ e => deployEncrypted(e)} type="file" />
      <button onClick={()=>{applyAccessConditions()}}>Apply Access Consitions</button>
    </div>
  )
}

export default NewPoduct