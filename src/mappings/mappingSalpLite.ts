import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { BlockNumber, Balance, MessageId } from "@polkadot/types/interfaces";
import type { ParaId } from '@polkadot/types/interfaces/parachains';
import { SalpLiteIssued, SalpLiteRedeemed } from '../types/models';
import { postSlack } from '../common';

export async function handleSalpLiteIssued(event: SubstrateEvent): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const { event: { data: [account, para_id, balance, message_id] } } = event;
  const record = new SalpLiteIssued(blockNumber.toString() + '-' + event.idx.toString());
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic.idx;
  record.block_timestamp = event.block.timestamp;
  record.account = account.toString();
  record.para_id = (para_id as ParaId).toNumber();
  record.balance = (balance as Balance).toBigInt();
  record.message_id = (message_id as MessageId).toString();
  await record.save();
}

export async function handleSalpLiteRedeemed(event: SubstrateEvent): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const { event: { data: [account, para_id, first_slot, last_slot, balance] } } = event;
  const record = new SalpLiteRedeemed(blockNumber.toString() + '-' + event.idx.toString());
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic.idx;
  record.block_timestamp = event.block.timestamp;
  record.account = account.toString();
  record.para_id = (para_id as ParaId).toNumber();
  record.first_slot = first_slot.toString();
  record.last_slot = last_slot.toString();
  record.balance = (balance as Balance).toBigInt();
  record.state = "Pending";
  await record.save();
  const text =
    '```block_height: ' + blockNumber.toString() +
    '\nblock_timestamp: ' + event.block.timestamp.toString() +
    '\nevent_id: ' + event.idx.toString() +
    '\nextrinsic_id: ' + event.extrinsic.idx.toString() +
    '\nevent: ' + event.event.data.toString() +
    '```';
  postSlack(text);
}