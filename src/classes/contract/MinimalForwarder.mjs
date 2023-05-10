import Contract from '../Contract.mjs';

export default class MinimalForwarderContract extends Contract {
    static name = 'MinimalForwarder';

    getInputTypesOfFunction(fnName) {               
        const fn = this.data.options.jsonInterface.find(({name}) => name === fnName);
        const inputs = fn.inputs.find(({name}) => name === 'req').components;        
        return inputs.map(({name, type}) => ({name, type}));
    }
}