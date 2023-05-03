import dotenv from 'dotenv';
import {createClient} from '../../classes/client/Tatum.mjs';
import Contract from '../../classes/Contract.mjs';
import Web3 from 'web3';
import HTTPProvider from 'web3-providers-http';

dotenv.config();

const client = await createClient(process.env.ADMIN_PRIVATE_KEY);
console.log('test', client);
console.log(client.address, client.kit.web3.eth.getBalance);

console.log(await client.kit.web3.eth.getBalance(client.address));



// const nftContract = await client.resolveContract('RentableNft', Contract);
// console.log(nftContract);

console.log(client.kit.web3.currentProvider);
// const test = await client.kit.web3.currentProvider.sendAsync({
//     method: "gas-pump",
//     params: [],
//     jsonrpc: "2.0",
//     id: new Date().getTime()
// });
// console.log(test);


// const url = `https://api-eu1.tatum.io/v3/gas-pump/`;    
// const options = {
//   keepAlive: true,
//   withCredentials: false,
//   timeout: 20000, // ms
//   headers: [
//     { name: 'Content-Type', value: 'application/json'},
//     { name: 'x-api-key', value: process.env.TATUM_API_KEY}
//   ]
// };

// const web3 = new Web3(new HTTPProvider(url, options));

// const requestOptions = {
//     chain: 'CELO',
//     owner: process.env.ADMIN_PUBLIC_KEY,
//     from: 10,
//     to: 20
// };

// console.log(requestOptions);
// if (!web3.currentProvider.connected) {
//   web3.setProvider(new HTTPProvider(url, options))
// }
// console.log(web3.currentProvider.connected);
// web3.currentProvider.send(requestOptions, (error, result) => {
//   if (error) {
//     console.error("Error:", error);
//   } else {
//     console.log("Result:", result);
//   }
// });




// const url = `https://api.tatum.io/v3/blockchain/node/${process.env.TATUM_NETWORK}/${process.env.TATUM_API_KEY}/`;    
// const options = {
//   keepAlive: true,
//   withCredentials: false,
//   timeout: 20000, // ms
//   headers: [
//     { name: 'Content-Type', value: 'application/json'},
//     { name: 'x-api-key', value: process.env.TATUM_API_KEY}
//   ]
// };
// const web3 = new Web3(new HTTPProvider(url, options));    

// console.log(await web3.eth.getBalance(process.env.ADMIN_PUBLIC_KEY));