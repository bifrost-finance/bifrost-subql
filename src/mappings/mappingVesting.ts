import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { BlockNumber, Balance, MessageId } from "@polkadot/types/interfaces";
import { Vesting } from '../types/models';
import { postSlack } from '../common';

const NativeToken = JSON.stringify({ "native": "BNC" });

export async function handleVestingVestingUpdated(event: SubstrateEvent): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const { event: { section, method, data: [account, balance] } } = event;
  const record = new Vesting(blockNumber.toString() + '-' + event.idx.toString());
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.section = section.toString();
  record.method = method.toString();
  record.account = account.toString();
  record.currency = NativeToken;
  record.balance = (balance as Balance).toBigInt();
  await record.save();

  const text =
    '```block_height: ' + blockNumber.toString() +
    '\nevent: ' + section.toString() + '.' + method.toString() +
    '\naccount: ' + account.toString() +
    '\nbalance: ' + balance.toHuman();
  postSlack(account.toString(), text);
}

export async function handleVestingVestingCompleted(event: SubstrateEvent): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const { event: { section, method, data: [account] } } = event;
  const record = new Vesting(blockNumber.toString() + '-' + event.idx.toString());
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.section = section.toString();
  record.method = method.toString();
  record.account = account.toString();
  record.currency = NativeToken;
  await record.save();

  const text =
    '```block_height: ' + blockNumber.toString() +
    '\nevent: ' + section.toString() + '.' + method.toString();
  postSlack(account.toString(), text);
}