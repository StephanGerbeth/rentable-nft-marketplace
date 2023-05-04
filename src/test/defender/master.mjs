import dotenv from 'dotenv';
import {createClient} from '../../classes/Client.mjs';
import Contract from '../../classes/Contract.mjs';
import Marketplace from '../../classes/Marketplace.mjs';
import { filter } from 'rxjs';

dotenv.config();

const master = await createClient(process.env.MASTER_PRIVATE_KEY);
console.log(master.address);

const nftContract = await master.resolveContract('RentableNft', Contract);
const forwarderContract = await master.resolveContract('MinimalForwarder', Contract);
// console.log(await forwarderContract.data.methods.getNonce(master.address).call());
const request = await nftContract.mintNFT('ipfs://bafybeiffapvkruv2vwtomswqzxiaxdgm2dflet2cxmh6t4ixrgaezumbw4', forwarderContract)
console.log(request);
// const gasLimit = (parseInt(request.gas) + 50000).toString()
// console.log(signature, request, forwarderContract);
const result = await fetch(process.env.DEFENDER_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
})
// const tx = await forwarderContract.data.methods.execute(request, signature).call();
console.log('BOOM', await result.json());
// const tokenId = Number(tx.events.Transfer.returnValues.tokenId);
