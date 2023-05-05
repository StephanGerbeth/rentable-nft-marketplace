import {signMetaTxRequest} from '../utils/transaction/meta.mjs';
export default class Contract {
    constructor(kit, data) {
        this.kit = kit;
        this.data = data;
    }

    get address() {
        return this.data._address;
    }

    async getGasPrice() {
        return this.kit.web3.eth.getGasPrice()
    }

    async mintNFT(tokenURI, forwarder) {                
        const tx = await this.data.methods.mint(tokenURI);        
        const gasPrice = await this.getGasPrice();
        const gas = await tx.estimateGas({from: this.kit.defaultAccount})        
        const options = {
            from: this.kit.defaultAccount,                     
            data: tx.encodeABI(),
            gas,
            gasPrice
        };        
        if(forwarder) {                       
            return signMetaTxRequest(this.kit.web3.currentProvider, forwarder, {
                ...options,
                to: this.kit.defaultAccount                
            }, this.kit);
        } else {
            return tx.send(options);
        }
    }
}