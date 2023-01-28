import { ethers } from 'ethers';
import lighthouse from '@lighthouse-web3/sdk';

declare var window: any

const Encryption = () => {
  const encryptionSignature = async() =>{
    if (typeof window !== "undefined" && window?.ethereum) {
      const provider = new ethers.providers.Web3Provider(window?.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const messageRequested = (await lighthouse.getAuthMessage(address)).data.message;
      const signedMessage = await signer.signMessage(messageRequested);
      return({
        signedMessage: signedMessage,
        publicKey: address
      });
    }
  }

  const progressCallback = ({total, uploaded}:{total: number, uploaded: number}) => {
    let percentageDone = 100 - (total / uploaded);
    console.log(percentageDone.toFixed(2));
  };

  const deployEncrypted = async(e: any) =>{
    const { publicKey, signedMessage } : any = await encryptionSignature()  ;
    const response = await lighthouse.uploadEncrypted(
      e,
      publicKey,
      "bb3be099-f338-4c1f-9f0c-a7eeb5caf65d",
      signedMessage,
      progressCallback
    );
    console.log(response);
  }

  return (
    <div>
      <input onChange={e=>deployEncrypted(e)} type="file" />
    </div>
  )
}

export default Encryption