import dotenv from 'dotenv';
import {createClient} from '../../classes/Client.mjs';
import { Relayer } from 'defender-relay-client';

dotenv.config();

const relayClient = new Relayer({ apiKey: process.env.DEFENDER_RELAYER_API_KEY, apiSecret: process.env.DEFENDER_RELAYER_SECRET_KEY });
console.log(relayClient);

const master = await createClient(process.env.MASTER_PRIVATE_KEY);
console.log('MASTER ADDRESS', master.address);

const nftContract = await master.getContract('RentableNft');
const forwarderContract = await master.getContract('MinimalForwarder');

console.log(await master.getBalance());

const result = await nftContract.mintNFT('ipfs://bafybeiffapvkruv2vwtomswqzxiaxdgm2dflet2cxmh6t4ixrgaezumbw4', {forwarder: forwarderContract})
console.log(result);

// setTimeout(async () => {
//     const latestTx = await relayClient.query(result.transactionId);
//     console.log(latestTx);
// }, 12000)

console.log(await master.getBalance());

