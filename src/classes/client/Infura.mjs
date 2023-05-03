import Web3 from 'web3';
import dotenv from 'dotenv';
import ContractKit from '@celo/contractkit';
import Client from '../Client.mjs';

dotenv.config();

export const createClient = async (privateKey) => {    
    return new Client({kit: await setupAccount(privateKey)});
}

const setupAccount = async (privateKey) => {    
    console.log(process.env.INFURA_NETWORK);
    const web3 = new Web3(new Web3.providers.HttpProvider(
        `https://${process.env.INFURA_NETWORK}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      ));    
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);     
    const kit = ContractKit.newKitFromWeb3(web3)
    kit.connection.addAccount(account.privateKey);    
    kit.defaultAccount = account.address;
    return kit;
}