import dotenv from 'dotenv';
import {createClient} from '../../classes/Client.mjs';
import RentableNFTContract from '../../classes/contract/RentableNFT.mjs'
import MinimalForwarderContract from '../../classes/contract/MinimalForwarder.mjs';

dotenv.config();

const master = await createClient(process.env.MASTER_PRIVATE_KEY);
console.log('MASTER ADDRESS', master.address);

const nftContract = await master.getContract(RentableNFTContract);
const forwarderContract = await master.getContract(MinimalForwarderContract);

console.log(await master.getBalance());

const result = await nftContract.mintNFT('ipfs://bafybeiffapvkruv2vwtomswqzxiaxdgm2dflet2cxmh6t4ixrgaezumbw4', {forwarder: forwarderContract})
console.log('TEST', result);

console.log(await master.getBalance());
