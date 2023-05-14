import { concatAll, map, switchMap, take, toArray } from "rxjs";
import Contract from '../Contract.mjs';
import { createMetaTx } from "../../utils/transaction/meta.mjs";

export default class MarketplaceContract extends Contract {
    static name = 'Marketplace';

    async getListings(contract) {
        const listings = await this.data.methods.getAllListings().call();
        return listings.filter(({nftContract}) => !contract || nftContract === contract.address)            
    }

    async listNFT({contract, tokenId, price, from, to}, options = {}) {     
        const listingFee = await this.data.methods.getListingFee().call()   
        const start = Math.ceil(from / 1000);
        const end = Math.floor(to / 1000);
        const tx = this.data.methods.listNFT(contract.address, tokenId, price, start, end);
        console.log('ListNFT', tx);

        const gasPrice = await this.kit.web3.eth.getGasPrice();            
        const txOptions = { 
            from: this.kit.defaultAccount, 
            to: this.address,   
            value: listingFee, 
            data: tx.encodeABI(),
            gas: await tx.estimateGas({from: this.kit.defaultAccount, value: listingFee})                    
        };

        if(options.forwarder) {                                                     
            return createMetaTx(this, options.forwarder, 'NFTListed').send({...txOptions});
        }

        return tx.send({...txOptions, gasPrice});        
    }

    // async unlistNFT(contract, {tokenId, pricePerDay}) {                
    //     const refund = await resolveRefund(contract, tokenId, pricePerDay)
    //     const tx = this.data.methods.unlistNFT(contract.address, tokenId);
    //     return this.#sendTransaction(tx, refund);                  
    // }

    // async unlistAllNFTsByContract(contract) {        
    //     const entry = await this.getListings(contract);
    //     return this.unlistNFT(contract, entry);
    // }
    
    // rentNFT(contract, duration) {
    //     // TODO: deploy new contract and increase rentable timeframe
    //     return this.getListings(contract).pipe(
    //         toArray(),
    //         map(durstenfeldShuffle),
    //         concatAll(),
    //         take(1),
    //         switchMap(({nftContract, tokenId, pricePerDay}) => {
    //             const now = Math.ceil(Date.now() / 1000);
    //             const expires = now + duration;                
    //             const tx = this.data.methods.rentNFT(nftContract, tokenId, expires)
                
    //             const numDays = (expires - now) / 60 / 60 / 24 + 1;
    //             const fee = Math.ceil(numDays * pricePerDay);
    //             return this.#sendTransaction(tx, fee);
    //         })
    //     );
    // }

    // async #sendTransaction(tx, value, options = {}) {
    //     const gasPrice = await this.kit.web3.eth.getGasPrice();    
    //     console.log(value, this.address);
    //     const txOptions = { 
    //         from: this.kit.defaultAccount, 
    //         to: this.address,   
    //         value, 
    //         data: tx.encodeABI(),
    //         gas: await tx.estimateGas({from: this.kit.defaultAccount, value})                    
    //     };
    //     if(options.forwarder) {                                                     
    //         return createMetaTx(this, options.forwarder, 'NFTListed').send({...txOptions, gasPrice});
    //     }
    //     return tx.send({...txOptions, gasPrice});        
    // }
}

// const resolveRefund = async (contract, tokenId, pricePerDay) => {
//     const expires = await contract.data.methods.userExpires(tokenId).call();             
//     const refund = Math.ceil((parseInt(expires) - Date.now() / 1000) / 60 / 60 / 24 + 1) * pricePerDay; 
//     return Math.max(0, refund);    
// }

// const durstenfeldShuffle = (array) => {
//     const shuffled = [...array];
//     for (let i = shuffled.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }
//     return shuffled;
//   }