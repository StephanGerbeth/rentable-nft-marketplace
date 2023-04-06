import { SDK, Auth } from "@infura/sdk";

const infuraMap = new Map();

class Infura {
    constructor(sdk) {
        this.sdk = sdk;
    }
}

export const getInfuraContext = (name='default') => {
    if(!infuraMap.has(name)) {
        const options = JSON.parse(process.env.INFURA_SDK_AUTH_OPTIONS);
        const auth = new Auth(options);
        const sdk = new SDK(auth);        
        infuraMap.set(name, new Infura(sdk));
    }
    return infuraMap.get(name);
}