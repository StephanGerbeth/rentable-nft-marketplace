import dotenv from 'dotenv';
import {createClient} from '../../classes/Client.mjs';

dotenv.config();

const admin = await createClient(process.env.ADMIN_PRIVATE_KEY);
console.log(admin.address);
// await admin.kit.web3.currentProvider.send({
//     method:"evm_setAccountBalance",
//     params:[admin.address, "0x3635c9adc5dea00000"]}, function() {}
// )
// console.log(await admin.kit.web3.eth.getBalance(admin.address));