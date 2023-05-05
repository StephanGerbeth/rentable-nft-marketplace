import dotenv from 'dotenv';
import {createClient} from '../../classes/Client.mjs';
import Contract from '../../classes/Contract.mjs';

dotenv.config();

const master = await createClient(process.env.MASTER_PRIVATE_KEY);
console.log('MASTER ADDRESS', master.address);

const nftContract = await master.resolveContract('RentableNft', Contract);
const forwarderContract = await master.resolveContract('MinimalForwarder', Contract);

const request = await nftContract.mintNFT('ipfs://bafybeiffapvkruv2vwtomswqzxiaxdgm2dflet2cxmh6t4ixrgaezumbw4', forwarderContract)
console.log(request);

const result = await fetch(process.env.DEFENDER_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
})

console.log(await result.json());

