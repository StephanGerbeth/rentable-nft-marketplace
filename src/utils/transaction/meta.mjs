// TUTORIAL: https://blog.openzeppelin.com/gasless-metatransactions-with-openzeppelin-defender/
// SAMPLE REPO: https://github.com/OpenZeppelin/workshops/tree/9402515b42efe1b4b3c5d8621fc78b55e7078386/25-defender-metatx-api

import { getEventByHash } from "../events.mjs";

import ethSigUtil from 'eth-sig-util';

const EIP712Domain = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' }
];
  

function getMetaTxTypeData(chainId, verifyingContract) {       
    return {
      types: {
        EIP712Domain,
        ForwardRequest: verifyingContract.getInputTypesOfFunction('verify'),
      },
      domain: {
        name: verifyingContract.name,
        version: '0.0.1',
        chainId,
        verifyingContract: verifyingContract.address,
      },
      primaryType: 'ForwardRequest',
    }
};

const buildRequest = async (forwarder, options) => {
    const nonce = (await forwarder.data.methods.getNonce(options.from).call()).toString();    
    return { nonce, ...options };
  }

const buildTypedData = async (forwarder, request) => {    
    const chainId = await forwarder.kit.web3.eth.getChainId();
    const typeData = getMetaTxTypeData(chainId, forwarder);
    return { ...typeData, message: request };
}

const signTypedData = async (contract, from, data) => {    
    const result = await contract.kit.signTypedData(from, data);    
    return `${result.r}${result.s.replace(/^0x/, '')}${result.v.toString(16)}`;
    // const privateKey = Buffer.from(process.env.MASTER_PRIVATE_KEY.replace(/^0x/, ''), 'hex');
    // return ethSigUtil.signTypedMessage(privateKey, { data });
} 

const buildRequestBody = async (contract, forwarder, options) => {
    const request = await buildRequest(forwarder, options);   
    console.log('REQUEST', request);
    const toSign = await buildTypedData(forwarder, request);       
    const signature = await signTypedData(contract, options.from, toSign);  

    return { signature, request };
}

export const createMetaTx = (contract, forwarder, eventName) => {     
    return {
        async send(options) {            
            const requestBody = await buildRequestBody(contract, forwarder, options);            
            const response = await fetch(process.env.DEFENDER_WEBHOOK_URL, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: { 'Content-Type': 'application/json' },
            });            
            const json = await response.json();            
            const { hash } = JSON.parse(json.result);
            console.log(eventName, hash);                  
            return getEventByHash(contract, eventName, hash)                   
        }
    }       
}