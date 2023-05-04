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

const signTypedData = async (signer, from, data) => {
    console.log(await signer.connection.signTypedData(from, data));
    return new Promise((resolve, reject) => {
        signer.send({method: 'eth_signTypedData', params: [from, data]}, (e, r) => {
            if(e) {
                reject(e);
            }
            resolve(r.result);
        })
    });
  }
  

export const signMetaTxRequest = async (signer, forwarder, input) => {    
    const request = await buildRequest(forwarder, input);   
    const toSign = await buildTypedData(forwarder, request);   
    const signature = await signTypedData(signer, input.from, toSign);   
    return { signature, request };
}