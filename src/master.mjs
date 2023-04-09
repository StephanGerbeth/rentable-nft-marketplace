import dotenv from 'dotenv';
import {createClient} from './classes/Client.mjs';
import Contract from './classes/Contract.mjs';
import Marketplace from './classes/Marketplace.mjs';
import { getInfuraContext } from './context/Infura.mjs';

dotenv.config();

const master = await createClient(process.env.PRIVATE_KEY);
console.log(master.address);

const nftContract = await master.resolveContract('RentableNft', Contract);
const contractMarketplace = await master.resolveContract('Marketplace', Marketplace);


// const infura = getInfuraContext();
// const { assets } = await infura.sdk.api.getNFTs({
//     publicAddress: master.address,
//     includeMetadata: false,
// });
// console.log(assets);


contractMarketplace.getListings().subscribe((e) => {
    console.log(e);
});
