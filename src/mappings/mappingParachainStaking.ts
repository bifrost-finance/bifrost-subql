import { SubstrateBlock, SubstrateEvent, SubstrateExtrinsic } from "@subql/types";
import { BlockNumber, Balance, MessageId } from "@polkadot/types/interfaces";
import { ParachainStakingRewarded, ScheduleRevokeDelegation } from '../types/models';

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

export async function handleScheduleRevokeDelegation(extrinsic: SubstrateExtrinsic): Promise<void> {
  // const record = await StarterEntity.get(extrinsic.block.block.header.hash.toString());
  // //Date type timestamp
  // record.field4 = extrinsic.block.timestamp;
  // await record.save();

  const record = new ScheduleRevokeDelegation(extrinsic.block.block.header.hash.toString());
  record.call = "schedule_revoke_delegation";
  record.extrinsic_id = extrinsic.idx;
  record.block_timestamp = extrinsic.block.timestamp;
  record.block_height = extrinsic.block.block.header.number.toBigInt();
  let args = JSON.parse(JSON.stringify(extrinsic.extrinsic.signer)).id;
  // extrinsic.extrinsic.

  record.candidate = extrinsic.extrinsic.args[0].toString();
  // logger.info(blockHeight);
  logger.info(args);
  record.delegator = JSON.parse(JSON.stringify(extrinsic.extrinsic.signer)).id;

  // const moment = extrinsic.extrinsic.args[0] as Compact<Moment>;
  // record.timestamp = new Date(moment.toNumber());
  await record.save();

}

export async function handleDelegatorBondMore(extrinsic: SubstrateExtrinsic): Promise<void> {
  const record = new ScheduleRevokeDelegation(extrinsic.block.block.header.hash.toString());
  record.call = "delegator_bond_more";
  record.extrinsic_id = extrinsic.idx;
  record.block_timestamp = extrinsic.block.timestamp;
  record.block_height = extrinsic.block.block.header.number.toBigInt();
  // let args = JSON.stringify(extrinsic.extrinsic.args);
  record.candidate = extrinsic.extrinsic.args[0].toString();
  record.more = (extrinsic.extrinsic.args[1] as Balance).toBigInt();
  record.delegator = JSON.parse(JSON.stringify(extrinsic.extrinsic.signer)).id;
  await record.save();
}

export async function handleExecuteDelegationRequest(extrinsic: SubstrateExtrinsic): Promise<void> {
  const record = new ScheduleRevokeDelegation(extrinsic.block.block.header.hash.toString());
  record.call = "execute_delegation_request";
  record.extrinsic_id = extrinsic.idx;
  record.block_timestamp = extrinsic.block.timestamp;
  record.block_height = extrinsic.block.block.header.number.toBigInt();
  // let args = JSON.stringify(extrinsic.extrinsic.args);
  record.delegator = extrinsic.extrinsic.args[0].toString();
  record.candidate = extrinsic.extrinsic.args[1].toString();
  await record.save();

}