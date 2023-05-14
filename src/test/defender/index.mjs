import dotenv from 'dotenv';
import {createClient} from '../../classes/Client.mjs';
import RentableNFTContract from '../../classes/contract/RentableNFT.mjs'
import MinimalForwarderContract from '../../classes/contract/MinimalForwarder.mjs';
import MarketplaceContract from '../../classes/contract/Marketplace.mjs';
import { createEndDate, createStartDate } from '../../utils/date.mjs';

dotenv.config();

const master = await createClient(process.env.MASTER_PRIVATE_KEY);
console.log('MASTER ADDRESS', master.address);

const nftContract = await master.getContract(RentableNFTContract);
const forwarderContract = await master.getContract(MinimalForwarderContract);

console.log(await master.getBalance());

const result = await nftContract.mintNFT('ipfs://bafybeiffapvkruv2vwtomswqzxiaxdgm2dflet2cxmh6t4ixrgaezumbw4', {forwarder: forwarderContract})
console.log('TEST', result);

console.log(await master.getBalance());

const contractMarketplace = await master.getContract(MarketplaceContract);

const now = Date.now() + 5 * 1000;
// contractMarketplace.data.events.NFTListed({ fromBlock: 0 }).on('data', (e) => console.log('BLOB', e))
const r = await contractMarketplace.listNFT({
    contract: nftContract,
    tokenId: result.returnValues.tokenId, 
    price: master.kit.web3.utils.toWei('1', 'wei'),
    from: createStartDate(now),
    to: createEndDate(now, {days: 7})
}/*, {forwarder: forwarderContract}*/);

console.log('HUCH', r);
console.log(await master.getBalance());