import dotenv from 'dotenv';
import {createClient} from './classes/Client.mjs';

dotenv.config();


const master = await createClient(process.env.PRIVATE_KEY);

const nftContract = await master.contracts.getContract('RentableNft');
const tx = await nftContract.mintNFT('ipfs://bafybeiffapvkruv2vwtomswqzxiaxdgm2dflet2cxmh6t4ixrgaezumbw4')
const tokenId = Number(tx.events.Transfer.returnValues.tokenId);

const contractMarketplace = await master.contracts.getContract('Marketplace');
// let txn = await contractMarketplace.proof(nftContract.data.methods.approve(contractMarketplace.data._address, tokenId));
// console.log(txn);

const listingFee = await contractMarketplace.data.methods.getListingFee().call();

const buffer = 3000;
const start = Math.ceil(Date.now() / 1000) + buffer;
const end = start + 5000;

const tx2 = await contractMarketplace.data.methods.listNFT(
  nftContract.data._address,
  tokenId, 
  '1000000000000000000',
  start, 
  end
);

const gas = await tx2.estimateGas({from: master.kit.defaultAccount})
const options = {
  from    : master.kit.defaultAccount,
  value   : listingFee,         
  data    : tx2.encodeABI(),
  gas     : gas,
  gasPrice: '200000000000'
};     
tx2.send(options);  