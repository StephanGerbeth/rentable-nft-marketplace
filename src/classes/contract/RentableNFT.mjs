import { createMetaTx } from '../../utils/transaction/meta.mjs';
import Contract from '../Contract.mjs';

export default class RentableNFTContract extends Contract {
    static name = 'RentableNFT';

    async mintNFT(tokenURI, options = {}) {                
        const tx = await this.data.methods.mint(tokenURI);    
        const txOptions = {
            from: this.kit.defaultAccount,   
            to: this.address,                  
            data: tx.encodeABI(),
            gas: await tx.estimateGas({from: this.kit.defaultAccount})
        };        

        if(options.forwarder) {                                         
            return createMetaTx(this, options.forwarder).send(txOptions, this);
        }

        return tx.send({...txOptions, gasPrice: await this.getGasPrice()});        
    }
}