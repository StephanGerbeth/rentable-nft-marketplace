import { filter, firstValueFrom, fromEventPattern } from 'rxjs';

export const getTransferEventByHash = async (contract, hash) => {    
    return firstValueFrom(fromEventPattern(
        (handler) => contract.data.events.Transfer({ fromBlock: 'latest' }).on('data', handler),
        (_, signal) => signal.unsubscribe()
    ).pipe(filter((e) => e.transactionHash === hash)));
}