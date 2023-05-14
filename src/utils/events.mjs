import { filter, firstValueFrom, fromEventPattern } from 'rxjs';

export const getEventByHash = async (contract, eventName, hash) => {    
    return firstValueFrom(fromEventPattern(
        (handler) => contract.data.events[eventName]({ fromBlock: 'latest' }).on('data', handler),
        (_, signal) => signal.unsubscribe()
    ).pipe(filter((e) => e.transactionHash === hash)));
}