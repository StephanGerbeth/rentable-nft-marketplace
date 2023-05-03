import dotenv from 'dotenv';
import {createClient} from '../../classes/Client.mjs';
import Contract from '../../classes/Contract.mjs';

dotenv.config();

const vendor = await createClient(process.env.ADMIN_PRIVATE_KEY)
const master = await createClient(process.env.MASTER_PRIVATE_KEY);
const payer = await createClient(process.env.CLIENT_PRIVATE_KEY);

const loyaltyProgramContract = await master.resolveContract('LoyaltyProgram', Contract);
const loyaltyTokenAddress = await loyaltyProgramContract.loyaltyToken();
const loyaltyToken = await master.resolveContract('LoyaltyToken', Contract, loyaltyTokenAddress);
console.log(await loyaltyToken.data.methods.balanceOf(payer.address).call());

console.log(vendor.address);
const loyaltyProgramContractVendor = await vendor.resolveContract('LoyaltyProgram', Contract);
try {
    console.log(await loyaltyProgramContractVendor.registerVendor());
} catch(e) {
    console.log('ALREADY REGISTERED', e);
}

console.log(await loyaltyProgramContract.data.methods.isVendorRegistered(vendor.address).call());

const token = await master.resolveContract('Token', Contract);
console.log(await token.data.methods.balanceOf(payer.address).call());
