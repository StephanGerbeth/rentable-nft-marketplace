import Web3 from 'web3';
import ContractKit from '@celo/contractkit';
import { createContract } from './Contract.mjs';

export default class Client {
    constructor({kit}) {
        this.kit = kit;                   
    }

    get address () {
        return this.kit.defaultAccount;
    }

    async getBalance() {
        return this.kit.web3.eth.getBalance(this.kit.defaultAccount);
    }

    async getNetworkId() {
        return this.kit.web3.eth.net.getId();
    } 

    async getContract(Clazz) {
        return createContract(this.kit, Clazz);        
    }
};

export const createClient = async (privateKey) => {    
    return new Client({kit: await setupAccount(privateKey)});
}

const setupAccount = async (privateKey) => {    
    const web3 = new Web3('wss://alfajores-forno.celo-testnet.org/ws');    
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);      
    const kit = ContractKit.newKitFromWeb3(web3)
    kit.connection.addAccount(account.privateKey);    
    kit.defaultAccount = account.address;
    return kit;
}