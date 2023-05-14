'use strict';

var ethers$1 = require('ethers');
var ethers = require('defender-relay-client/lib/ethers');

const abi=[{inputs:[],stateMutability:"nonpayable",type:"constructor"},{inputs:[{internalType:"address",name:"from",type:"address"}],name:"getNonce",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function",constant:true},{inputs:[{components:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"value",type:"uint256"},{internalType:"uint256",name:"gas",type:"uint256"},{internalType:"uint256",name:"nonce",type:"uint256"},{internalType:"bytes",name:"data",type:"bytes"}],internalType:"struct MinimalForwarder.ForwardRequest",name:"req",type:"tuple"},{internalType:"bytes",name:"signature",type:"bytes"}],name:"verify",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function",constant:true},{inputs:[{components:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"value",type:"uint256"},{internalType:"uint256",name:"gas",type:"uint256"},{internalType:"uint256",name:"nonce",type:"uint256"},{internalType:"bytes",name:"data",type:"bytes"}],internalType:"struct MinimalForwarder.ForwardRequest",name:"req",type:"tuple"},{internalType:"bytes",name:"signature",type:"bytes"}],name:"execute",outputs:[{internalType:"bool",name:"",type:"bool"},{internalType:"bytes",name:"",type:"bytes"}],stateMutability:"payable",type:"function",payable:true}];const networks={"44787":{events:{},links:{},address:"0x00c09c12b5A8f3339d3e1D06C1E772DbC025c585",transactionHash:"0x819f42c9d19b9d38ee7efe4dc5d045695c3a552bf059bff2cbcb3ec95ed920eb"}};

const ForwarderAbi = abi;
const ForwarderAddress = networks["44787"].address;


async function relay(forwarder, request, signature, whitelist) {
  // Decide if we want to relay this request based on a whitelist
  const accepts = !whitelist || whitelist.includes(request.to);
  if (!accepts) throw new Error(`Rejected request to ${request.to}`);
  
  // Validate request on the forwarder contract
  const valid = await forwarder.verify(request, signature);
  if (!valid) throw new Error(`Invalid request`);
  
  // Send meta-tx through relayer to the forwarder contract
  const gasLimit = (parseInt(request.gas) + 500000).toString();
  return await forwarder.execute(request, signature, { gasLimit });
}

async function handler(event) {
  // Parse webhook payload
  if (!event.request || !event.request.body) throw new Error(`Missing payload`);
  const { request, signature } = event.request.body;
  console.log(`Relaying`, request);
  
  // Initialize Relayer provider and signer, and forwarder contract
  const credentials = { ... event };
  const provider = new ethers.DefenderRelayProvider(credentials);
  const signer = new ethers.DefenderRelaySigner(credentials, provider, { speed: 'fast' });
  const forwarder = new ethers$1.Contract(ForwarderAddress, ForwarderAbi, signer);
  
  // Relay transaction!
  const tx = await relay(forwarder, request, signature);
  console.log(`Sent meta-tx: ${tx.hash}`);
  return tx;
}

module.exports = {
  handler,
  relay,
};
