import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { Balance } from "@polkadot/types/interfaces";
import { BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from '@polkadot/types';
import { ParachainStakingInfo } from "../types/models/ParachainStakingInfo";
import { ParachainStakingRewarded } from "../types/models/ParachainStakingRewarded";

export async function parachainStaking(block: SubstrateBlock): Promise<void> {
    const blockNumber = (block.block.header.number as Compact<BlockNumber>).toBigInt();

    const parachainStakingEvents = block.events.filter(e => e.event.section === 'parachainStaking') as SubstrateEvent[];
    for (let parachainStakingEvent of parachainStakingEvents) {
        const { event: { data, method } } = parachainStakingEvent;
        const record = new ParachainStakingInfo(blockNumber.toString() + '-' + parachainStakingEvent.idx.toString());
        record.block_height = blockNumber;
        record.block_timestamp = block.timestamp;
        record.method = method.toString();
        record.data = data.toString();
        await record.save();
    }
    return;
}

export async function handleParachainStakingRewarded(event: SubstrateEvent): Promise<void> {
    const blockNumber =  event.block.block.header.number.toNumber();

    const { event: { data: [account, balance] } } = event;
    const record = new ParachainStakingRewarded(`${blockNumber}-${event.idx.toString()}`);
    record.block_height = blockNumber;
    record.block_timestamp = event.block.timestamp;
    record.account = account.toString();
    record.balance = (balance as Balance).toBigInt();
    await record.save();
}

