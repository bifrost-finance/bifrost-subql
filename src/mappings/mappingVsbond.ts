import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { BlockNumber, Balance } from "@polkadot/types/interfaces";
import { Compact } from '@polkadot/types';
import BigNumber from "bignumber.js";
import { VsbondInfo, VsBondOrderClinchd } from "../types/models";
import { getPrice } from "../common";

export async function vsbond(block: SubstrateBlock): Promise<void> {
  const blockNumber = (block.block.header.number as Compact<BlockNumber>).toBigInt();

  const vsbondEvents = block.events.filter(e => e.event.section === 'vsBondAuction') as SubstrateEvent[];
  for (let vsbondEvent of vsbondEvents) {
    const { event: { data, section, method } } = vsbondEvent;
    const record = new VsbondInfo(blockNumber.toString() + '-' + vsbondEvent.idx.toString());
    record.block_height = blockNumber;
    record.block_timestamp = block.timestamp;
    record.method = method.toString();
    record.data = data.toString();
    await record.save();
  }
  return;
}

export async function handleVsBondAuctionOrderClinchd(event: SubstrateEvent): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const kusama_price = await getPrice(event.block, 'kusama');
  const { event: { section, method, data: [order_id, order_type, order_creator, order_opponent, vsbond_type,
    vsbond_amount_clinched, vsbond_amount, vsbond_remain, total_price] } } = event;
  const record = new VsBondOrderClinchd(blockNumber.toString() + '-' + event.idx.toString());
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.currency = vsbond_type.toString();
  record.total_price = (total_price as Balance).toBigInt();
  record.amount = (vsbond_amount as Balance).toBigInt();
  const price = new BigNumber(kusama_price.usd).multipliedBy(record.total_price.toString()).div(record.amount.toString());
  record.price = parseFloat(price.toFixed(8));
  await record.save();
}