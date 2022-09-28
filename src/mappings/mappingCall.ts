import { SubstrateExtrinsic, SubstrateEvent } from "@subql/types";
import { BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";

import { CallExtrinsic } from "../types";

export async function handleCallExtrinsic(
  extrinsic: SubstrateExtrinsic
): Promise<void> {
  const { block, events } = extrinsic;
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  )?.toBigInt();

  const balancesWithdrawEvent = events.find(
    (e) => e.event.section === "balances" && e.event.method === "Withdraw"
  ) as SubstrateEvent;
  if (balancesWithdrawEvent) {
    const {
      event: {
        data: [account, _],
      },
    } = balancesWithdrawEvent;
    const record = new CallExtrinsic(
      blockNumber.toString() + "-" + extrinsic.idx.toString()
    );
    record.block_height = blockNumber;
    record.block_timestamp = balancesWithdrawEvent.block.timestamp;
    record.account = account.toString();

    await record.save();
  }
}
