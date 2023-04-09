import Web3 from 'web3';
import ContractKit from '@celo/contractkit';
import { loadContract } from '../utils/json.mjs';

class Client {
    constructor({kit}) {
        this.kit = kit;                   
    }

    get address () {
        return this.kit.defaultAccount;
    }

    async getBalance() {
        return this.kit.getTotalBalance(this.kit.defaultAccount)
    }

    async resolveContract(name, Clazz) {
        const contractConfig = await loadContract(name);   
        console.log(await this.kit.web3.eth.net.getId());          
        const deployedNetwork = contractConfig.networks[await this.kit.web3.eth.net.getId()];        
        let contract = new this.kit.web3.eth.Contract(contractConfig.abi, deployedNetwork && deployedNetwork.address);
        return new Clazz(this.kit, contract);
    }
};

export const createClient = async (privateKey) => {    
    return new Client(await setupAccount(privateKey));
}

const setupAccount = async (privateKey) => {    
    const web3 = new Web3('https://alfajores-forno.celo-testnet.org');
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);      
    const kit = ContractKit.newKitFromWeb3(web3)
    kit.connection.addAccount(account.privateKey);    
    kit.defaultAccount = account.address;;            
    return { kit };
}