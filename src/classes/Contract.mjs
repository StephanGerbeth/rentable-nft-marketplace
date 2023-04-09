export default class Contract {
    constructor(kit, data) {
        this.kit = kit;
        this.data = data;
    }

    get address() {
        return this.data._address;
    }

    async mintNFT(tokenURI) {                
        const tx = await this.data.methods.mint(tokenURI);
        
        const gas = await tx.estimateGas({from: this.kit.defaultAccount})
        const options = {
            from    : this.kit.defaultAccount,                     
            data    : tx.encodeABI(),
            gas     : gas,
            gasPrice: 200000000000
        };        
        return tx.send(options);
    }

    async setUser(tokenId, client, expiration) {        
        const tx = await this.data.methods.setUser(tokenId, client.address, expiration);
        const options = {
            from    : this.kit.defaultAccount,
            to      : tx._parent._address,
            data    : tx.encodeABI(),
            gas     : await tx.estimateGas({from: this.kit.defaultAccount}),
            gasPrice: 200000000000
        };
        const signed  = await this.kit.web3.eth.accounts.signTransaction(options, process.env.PRIVATE_KEY);
        return this.kit.web3.eth.sendSignedTransaction(signed.rawTransaction); 
    }
}