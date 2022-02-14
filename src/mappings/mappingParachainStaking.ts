import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { BlockNumber, Balance, MessageId } from "@polkadot/types/interfaces";
import { ParachainStakingRewarded } from '../types/models';

export async function handleParachainStakingRewarded(event: SubstrateEvent): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const { event: { data: [account, balance] } } = event;
  const record = new ParachainStakingRewarded(blockNumber.toString() + '-' + event.idx.toString());
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.account = account.toString();
  record.balance = (balance as Balance).toBigInt();
  await record.save();
}