import Web3 from 'web3';
import ContractKit from '@celo/contractkit';
import { loadContract } from '../utils/json.mjs';

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

    async resolveContract(name, Clazz, customNetworkAddress) {
        const {abi, networks} = await loadContract(name);           
        const network = networks[await this.getNetworkId()];        
        const contract = new this.kit.web3.eth.Contract(abi, customNetworkAddress || (network && network.address));
        return new Clazz(this.kit, contract);
    }
};

export const createClient = async (privateKey) => {    
    return new Client({kit: await setupAccount(privateKey)});
}

const setupAccount = async (privateKey) => {    
    const web3 = new Web3('https://alfajores-forno.celo-testnet.org');    
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);      
    const kit = ContractKit.newKitFromWeb3(web3)
    kit.connection.addAccount(account.privateKey);    
    kit.defaultAccount = account.address;
    return kit;
}