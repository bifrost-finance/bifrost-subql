import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from '@polkadot/types';
import { ZenlinkInfo } from "../types/models/ZenlinkInfo";

export async function zenlink(block: SubstrateBlock): Promise<void> {
  const blockNumber = (block.block.header.number as Compact<BlockNumber>).toBigInt();

  const zenlinkEvents = block.events.filter(e => e.event.section === 'zenlinkProtocol') as SubstrateEvent[];
  for (let zenlinkEvent of zenlinkEvents) {
    const { event: { data, section, method } } = zenlinkEvent;
    const record = new ZenlinkInfo(blockNumber.toString() + '-' + zenlinkEvent.idx.toString());
    record.blockHeight = blockNumber;
    record.method = method.toString();
    record.data = data.toString();
    await record.save();
  }

  return;
}