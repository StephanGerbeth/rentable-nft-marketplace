import dotenv from 'dotenv';
import { lastValueFrom } from 'rxjs';

import {createClient} from '../../classes/Client.mjs';
import Contract from '../../classes/Contract.mjs';
import Marketplace from '../../classes/Marketplace.mjs';
import { createEndDate, createStartDate } from '../../utils/date.mjs';

dotenv.config();

const master = await createClient(process.env.MASTER_PRIVATE_KEY);
console.log(master.address);

const nftContract = await master.resolveContract('RentableNft', Contract);
const tx = await nftContract.mintNFT('ipfs://bafybeiffapvkruv2vwtomswqzxiaxdgm2dflet2cxmh6t4ixrgaezumbw4')
const tokenId = Number(tx.events.Transfer.returnValues.tokenId);

const contractMarketplace = await master.resolveContract('Marketplace', Marketplace);

const balanceBefore = (await master.getBalance()).CELO.toString();

const now = Date.now() + 5 * 1000;
const period = { from: createStartDate(now), to: createEndDate(now, {days: 7}) };

const result = await lastValueFrom(contractMarketplace.listNFT(
  nftContract,
  tokenId, 
  master.kit.web3.utils.toWei('1', 'wei'),
  period
));

console.log('RESULT', result);

const balanceAfter = (await master.getBalance()).CELO.toString();
console.log({balanceBefore, balanceAfter});
console.log('diff', balanceBefore - balanceAfter);

// contractMarketplace.getListings().subscribe((e) => {
//     console.log(e);
// });
