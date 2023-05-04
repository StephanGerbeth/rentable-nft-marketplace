import dotenv from 'dotenv';
import {createClient} from '../../classes/Client.mjs';
import Contract from '../../classes/Contract.mjs';
import Marketplace from '../../classes/Marketplace.mjs';
import { filter } from 'rxjs';

dotenv.config();

const client = await createClient(process.env.CLIENT_PRIVATE_KEY);
console.log(client.address);

const nftContract = await client.resolveContract('RentableNft', Contract);
const contractMarketplace = await client.resolveContract('Marketplace', Marketplace);

const balanceBefore = await client.getBalance();
contractMarketplace.rentNFT(nftContract, 60 * 60 * 24).subscribe((e) => {
    console.log(e.events);
});

setTimeout(async () => {
    const balanceAfter = await client.getBalance();
    console.log({balanceBefore, balanceAfter});
    console.log('diff', balanceBefore - balanceAfter);
}, 10000)


// contractMarketplace.getListings().pipe(
//     filter(({user}) => user === client.address)
// ).subscribe((e) => {
//     console.log(e);
// })