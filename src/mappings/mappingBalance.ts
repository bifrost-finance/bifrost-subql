import { SubstrateEvent } from "@subql/types";
import { Balance, BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";

import { TotalTransfer } from "../types";

export async function handleCurrenciesTransferred(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = (
    event.block.block.header.number as Compact<BlockNumber>
  ).toBigInt();

  const {
    event: {
      section,
      method,
      data: [currency, from, to, balance],
    },
  } = event;
  const record = new TotalTransfer(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.section = section.toString();
  record.method = method.toString();
  record.from = from.toString();
  record.to = to.toString();
  record.currency = currency.toString();
  record.balance = (balance as Balance).toBigInt();
  await record.save();
}
