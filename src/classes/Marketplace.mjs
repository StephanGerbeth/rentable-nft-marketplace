import { concatAll, filter, from, map, mergeMap, switchMap, take, toArray } from "rxjs";

export default class Marketplace {
    constructor(kit, data) {
        this.kit = kit;
        this.data = data;
    }

    getListings(contract) {
        return from(this.data.methods.getAllListings().call()).pipe(
            concatAll(),
            filter(({nftContract}) => !contract || nftContract === contract.address)
        );
    }

    listNFT(contract, tokenId, price, {from, to}) {        
        return resolveListingFee(this).pipe(
            switchMap((listingFee) => {
                const start = Math.ceil(from / 1000);
                const end = Math.floor(to / 1000)
                const tx = this.data.methods.listNFT(contract.address, tokenId, price, start, end);
                return this.#sendTransaction(tx, listingFee);
            })
        );             
    }

    unlistNFT(contract, {tokenId, pricePerDay}) {                
        return resolveRefund(contract, tokenId, pricePerDay).pipe(
            switchMap((refund) => {
                const tx = this.data.methods.unlistNFT(contract.address, tokenId);
                return this.#sendTransaction(tx, refund);
            })
        );        
    }

    unlistAllNFTsByContract(contract) {        
        return this.getListings(contract).pipe(                        
            mergeMap((entry) => this.unlistNFT(contract, entry))
        );
    }
    
    rentNFT(contract, duration) {
        // TODO: deploy new contract and increase rentable timeframe
        return this.getListings(contract).pipe(
            toArray(),
            map(durstenfeldShuffle),
            concatAll(),
            take(1),
            switchMap(({nftContract, tokenId, pricePerDay}) => {
                const now = Math.ceil(Date.now() / 1000);
                const expires = now + duration;                
                const tx = this.data.methods.rentNFT(nftContract, tokenId, expires)
                
                const numDays = (expires - now) / 60 / 60 / 24 + 1;
                const fee = Math.ceil(numDays * pricePerDay);
                return this.#sendTransaction(tx, fee);
            })
        );
    }

    #sendTransaction(tx, value) {
        return from(this.kit.web3.eth.getGasPrice()).pipe(
            switchMap(async (gasPrice) => {
                const options = { 
                    from: this.kit.defaultAccount, 
                    value, 
                    // data: tx.encodeABI(),
                    gas: await tx.estimateGas({from: this.kit.defaultAccount, value, gasPrice})                    
                };
                return tx.send({...options, gasPrice});
            })
        );
    }
}

const resolveListingFee = (contract) => {
    return from(contract.data.methods.getListingFee().call());
}

const resolveRefund = (contract, tokenId, pricePerDay) => {
    return from(contract.data.methods.userExpires(tokenId).call()).pipe(
        map((expires) => {            
            const refund = Math.ceil((parseInt(expires) - Date.now() / 1000) / 60 / 60 / 24 + 1) * pricePerDay; 
            return Math.max(0, refund);
        })
    );
}

const durstenfeldShuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }