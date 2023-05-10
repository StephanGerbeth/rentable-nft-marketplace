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
}

export const createContract = async (kit, Clazz) => {
    const {abi, networks, contractName} = await loadContract(Clazz.name);             
    const network = networks[await kit.web3.eth.net.getId()];        
    const contract = new kit.web3.eth.Contract(abi, (network && network.address));
    return new Clazz(kit, contract, contractName);
}