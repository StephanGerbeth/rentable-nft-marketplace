import Web3 from 'web3';
import dotenv from 'dotenv';
import ContractKit from '@celo/contractkit';
import Client from '../Client.mjs';

dotenv.config();

class TatumClient extends Client {
    getGasPump() {

    }
}

export const createClient = async (privateKey) => {    
    return new TatumClient({kit: await setupAccount(privateKey)});
}

const setupAccount = async (privateKey) => {         
    const url = `https://api.tatum.io/v3/blockchain/node/${process.env.TATUM_NETWORK}/${process.env.TATUM_API_KEY}/`;    
    const web3 = new Web3(url);    
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);     
    const kit = ContractKit.newKitFromWeb3(web3)
    kit.connection.addAccount(account.privateKey);    
    kit.defaultAccount = account.address;    
    return kit;
}