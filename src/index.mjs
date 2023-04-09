import dotenv from 'dotenv';
import {createClient} from './classes/Client.mjs';
import Contract from './classes/Contract.mjs';
import Marketplace from './classes/Marketplace.mjs';
import { lastValueFrom, mergeMap, switchMap } from 'rxjs';
import { add, startOfDay, endOfDay } from 'date-fns';
import { createEndDate, createStartDate } from './utils/date.mjs';

dotenv.config();

const master = await createClient(process.env.PRIVATE_KEY);

const nftContract = await master.resolveContract('RentableNft', Contract);
const tx = await nftContract.mintNFT('ipfs://bafybeiffapvkruv2vwtomswqzxiaxdgm2dflet2cxmh6t4ixrgaezumbw4')
const tokenId = Number(tx.events.Transfer.returnValues.tokenId);

const contractMarketplace = await master.resolveContract('Marketplace', Marketplace);
// let txn = await contractMarketplace.proof(nftContract.data.methods.approve(contractMarketplace.data._address, tokenId));
// console.log(txn);

const now = Date.now() + 5 * 1000;
const period = { from: createStartDate(now), to: createEndDate(now, {days: 7}) };

const result = await lastValueFrom(contractMarketplace.listNFT(
  nftContract,
  tokenId, 
  master.kit.web3.utils.toWei('1', 'wei'),
  period
));

console.log('RESULT', result);

// contractMarketplace.rentNFT(nftContract, 60 * 60 * 24).subscribe((e) => {
//   console.log(e);
// });

// contractMarketplace.unlistAllNFTsByContract(nftContract).subscribe((e) => {
//   console.log(e);
// });


// contractMarketplace.getListings().pipe(
//   mergeMap((e) => {
//     return contractMarketplace.unlistNFT(nftContract, e)
//   })
// ).subscribe((e) => {
//     console.log(e);
// });