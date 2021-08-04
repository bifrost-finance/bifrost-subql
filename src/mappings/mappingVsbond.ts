import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from '@polkadot/types';
import { VsbondInfo } from "../types/models/VsbondInfo";

export async function vsbond(block: SubstrateBlock): Promise<void> {
  const blockNumber = (block.block.header.number as Compact<BlockNumber>).toBigInt();

  const vsbondEvent = block.events.find(e => e.event.section === 'vsbondAuction') as SubstrateEvent;
  if (vsbondEvent !== undefined) {
    const { event: { data, section, method } } = vsbondEvent;
    const record = new VsbondInfo(blockNumber.toString() + '-' + vsbondEvent.idx.toString());
    record.blockHeight = blockNumber;
    record.method = method.toString();
    record.data = data.toString();
    await record.save();
  }
  return;
}