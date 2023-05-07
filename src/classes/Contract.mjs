import { createMetaTx } from '../utils/transaction/meta.mjs';
import { loadContract } from '../utils/json.mjs';
export default class Contract {
    constructor(kit, data, name) {
        this.kit = kit;
        this.data = data;
        this.name = name;
    }

    get address() {
        return this.data._address;
    }

    async getGasPrice() {
        return this.kit.web3.eth.getGasPrice()
    }

    async mintNFT(tokenURI, options = {}) {                
        const tx = await this.data.methods.mint(tokenURI);    
        const txOptions = {
            from: this.kit.defaultAccount,   
            to: options.to || this.address,                  
            data: tx.encodeABI(),
            gas: await tx.estimateGas({from: this.kit.defaultAccount})
        };        

        if(options.forwarder) {                                         
            return createMetaTx(this.kit, options.forwarder).send(txOptions);
        }

        return tx.send({...txOptions, gasPrice: await this.getGasPrice()});        
    }

    getInputTypesOfFunction(fnName) {               
        const fn = this.data.options.jsonInterface.find(({name}) => name === fnName);
        const inputs = fn.inputs.find(({name}) => name === 'req').components;        
        return inputs.map(({name, type}) => ({name, type}));
    }
}

export const createContract = async (kit, name, chainId, customNetworkAddress) => {
    const {abi, networks, contractName} = await loadContract(name);             
    const network = networks[chainId];        
    const contract = new kit.web3.eth.Contract(abi, customNetworkAddress || (network && network.address));
    return new Contract(kit, contract, contractName);
}