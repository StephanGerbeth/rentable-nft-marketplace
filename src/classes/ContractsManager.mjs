import Contract from './Contract.mjs';
import {loadContract} from '../utils/json.mjs'

export default class ContractsManager {
    constructor(web3, kit) {
        this.web3 = web3;
        this.kit = kit;
    }

    async getContract(name) {     
        const contractConfig = await loadContract(name);             
        const deployedNetwork = contractConfig.networks[await this.web3.eth.net.getId()];        
        let contract = new this.web3.eth.Contract(contractConfig.abi, deployedNetwork && deployedNetwork.address);
        return new Contract(this.web3, this.kit, contract);
    }
}