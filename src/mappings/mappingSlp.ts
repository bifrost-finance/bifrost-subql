import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";

import { SlpInfo } from "../types";

export async function handleSlp(block: SubstrateBlock): Promise<void> {
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  ).toBigInt();
  const slpEvents = block.events.filter(
    (e) => e.event.section === "slp"
  ) as SubstrateEvent[];

  for (let slpEvent of slpEvents) {
    const {
      event: { data, method },
    } = slpEvent;
    const record = new SlpInfo(
      blockNumber.toString() + "-" + slpEvent.idx.toString()
    );

    record.block_height = blockNumber;
    record.block_timestamp = block.timestamp;
    record.method = method.toString();
    record.data = data.toString();

    await record.save();
  }
}
