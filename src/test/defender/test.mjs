import dotenv from 'dotenv';
import { CeloAlfajoresTestnet } from "@thirdweb-dev/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { loadContract } from '../../utils/json.mjs';

dotenv.config();

const sdk = ThirdwebSDK.fromPrivateKey(
    process.env.MASTER_PRIVATE_KEY, // Your wallet's private key (only required for write operations)
    CeloAlfajoresTestnet.slug,
    {
        gasless: {
            // By specifying a gasless configuration - all transactions will get forwarded to enable gasless transactions
            openzeppelin: {
                relayerUrl: "https://api.defender.openzeppelin.com/autotasks/071f3a2d-9887-4226-8592-80aacc7f4493/runs/webhook/3887a917-d587-4992-921f-0ab712d04eaf/XPCTdzEmmyQAT5Uizo1GkC", // your OZ Defender relayer URL
                relayerForwarderAddress: "0x00c09c12b5A8f3339d3e1D06C1E772DbC025c585", // the OZ defender relayer address (defaults to the standard one)
                useEOAForwarder: true,
            }
        }
    }
);
console.log(CeloAlfajoresTestnet);

const {abi, networks, contractName} = await loadContract('RentableNFT');    

const contract = await sdk.getContract(networks[CeloAlfajoresTestnet.chainId].address, abi);
const tx = await contract.call('mint', [
    'ipfs://bafybeiffapvkruv2vwtomswqzxiaxdgm2dflet2cxmh6t4ixrgaezumbw4'
], {
    // gasLimit: 10000000000000,
    value: 0
});
// const signedTx = await tx.sign();
// console.log();
// const result = await signedTx.send();
console.log(tx);
