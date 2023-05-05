// import ethSigUtil from 'eth-sig-util';

const EIP712Domain = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' }
  ];
  
  const ForwardRequest = [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'gas', type: 'uint256' },
    // { name: 'gasPrice', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'data', type: 'bytes' },
  ];

function getMetaTxTypeData(chainId, verifyingContract) {
    return {
      types: {
        EIP712Domain,
        ForwardRequest,
      },
      domain: {
        name: 'MinimalForwarder',
        version: '0.0.1',
        chainId,
        verifyingContract,
      },
      primaryType: 'ForwardRequest',
    }
};

const buildRequest = async (forwarder, input) => {
    const nonce = (await forwarder.data.methods.getNonce(input.from).call()).toString();    
    return { value: 0, nonce, ...input };
  }

const buildTypedData = async (forwarder, request) => {
    const chainId = await forwarder.data.currentProvider.connection.chainId();
    const typeData = getMetaTxTypeData(chainId, forwarder.address);
    return { ...typeData, message: request };
}

const signTypedData = async (from, data, kit) => {    
    const result = await kit.signTypedData(from, data);    
    return `${result.r}${result.s.replace(/^0x/, '')}${result.v.toString(16)}`;
    // const privateKey = Buffer.from(process.env.MASTER_PRIVATE_KEY.replace(/^0x/, ''), 'hex');
    // return ethSigUtil.signTypedMessage(privateKey, { data });
  }
  

export const signMetaTxRequest = async (signer, forwarder, input, kit) => {    
    const request = await buildRequest(forwarder, input);   
    const toSign = await buildTypedData(forwarder, request);       
    const signature = await signTypedData(input.from, toSign, kit);   
    return { signature, request };
}