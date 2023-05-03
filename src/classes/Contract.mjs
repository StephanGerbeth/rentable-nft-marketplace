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

    async mintNFT(tokenURI) {                
        const tx = await this.data.methods.mint(tokenURI);
        const gasPrice = await this.getGasPrice();
        const gas = await tx.estimateGas({from: this.kit.defaultAccount})
        const options = {
            from: this.kit.defaultAccount,                     
            data: tx.encodeABI(),
            gas,
            gasPrice
        };        
        return tx.send(options);
    }

    // async loyaltyToken() {
    //     return this.data.methods.loyaltyToken().call();               
    // }

    // async registerVendor() {
    //    const tx = this.data.methods.registerVendor();
    //    const gas = await tx.estimateGas({from: this.kit.defaultAccount})
    //     const options = {
    //         from    : this.kit.defaultAccount,                     
    //         data    : tx.encodeABI(),
    //         gas     : gas,
    //         gasPrice: 200000000000
    //     };        
    //     return tx.send(options);
    // }
}
