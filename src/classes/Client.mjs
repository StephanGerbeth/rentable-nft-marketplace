import Web3 from 'web3';
import ContractKit from '@celo/contractkit';

import ContractsManager from './ContractsManager.mjs';

class Client {
    constructor({web3, kit}) {
        this.kit = kit;                   
        this.contracts = new ContractsManager(web3, kit);
    }

    get address () {
        return this.kit.defaultAccount;
    }

    async getBalance() {
        return this.kit.getTotalBalance(this.kit.defaultAccount)
    }
};

export const createClient = async (key) => {    
    return new Client(await setupAccount(key));
}

const setupAccount = async (key) => {    
    const web3 = new Web3('https://alfajores-forno.celo-testnet.org')
    const kit = ContractKit.newKitFromWeb3(web3)
    kit.connection.addAccount(key);
    const accounts = await kit.web3.eth.getAccounts()   
    kit.defaultAccount = accounts[0];    
    return { web3, kit };
}