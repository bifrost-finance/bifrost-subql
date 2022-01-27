import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { Balance, BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from '@polkadot/types';
import BigNumber from "bignumber.js";
import { ZenlinkInfo } from "../types/models/ZenlinkInfo";
import { ZenlinkLiquidityCalculation } from "../types/models/ZenlinkLiquidityCalculation";
import { getPrice, getZenlinkTokenName, toUnitToken } from "../common";

export async function zenlink(block: SubstrateBlock): Promise<void> {
  const blockNumber = (block.block.header.number as Compact<BlockNumber>).toBigInt();

  const zenlinkEvents = block.events.filter(e => e.event.section === 'zenlinkProtocol') as SubstrateEvent[];
  for (let zenlinkEvent of zenlinkEvents) {
    const { event: { data, section, method } } = zenlinkEvent;
    const record = new ZenlinkInfo(blockNumber.toString() + '-' + zenlinkEvent.idx.toString());
    record.block_height = blockNumber;
    record.block_timestamp = block.timestamp;
    record.method = method.toString();
    record.data = data.toString();
    await record.save();
  }
  return;
}

export async function zenlinkAssetSwap(event: SubstrateEvent): Promise<void> {
  const { event: { data: [owner, recipient, swap_path, balances] } } = event;
  const swap_path_obj = JSON.parse(swap_path.toString());
  const balances_obj = JSON.parse(balances.toString());
  const blockNumber = (event.extrinsic.block.block.header.number as Compact<BlockNumber>).toBigInt();

  const asset0 = getZenlinkTokenName(swap_path_obj[0].assetIndex)
  const asset1 = getZenlinkTokenName(swap_path_obj[swap_path_obj.length - 1].assetIndex)
  const entity = new ZenlinkLiquidityCalculation(blockNumber.toString() + '-' + event.idx.toString());
  const token_price = await getPrice(event.extrinsic.block, asset0.coin_id || asset1.coin_id);
  const amount_balance = asset0.coin_id ? toUnitToken(balances_obj[0], asset0.decimal) : toUnitToken(balances_obj[swap_path_obj.length - 1], asset1.decimal)

  entity.block_height = blockNumber;
  entity.block_timestamp = event.extrinsic.block.timestamp;
  entity.event_id = event.idx;
  entity.extrinsic_id = event.extrinsic.idx;
  entity.owner = owner.toString();
  entity.recipient = recipient.toString();
  entity.asset_0 = swap_path_obj[0];
  entity.asset_1 = swap_path_obj[swap_path_obj.length - 1];
  entity.asset_0_name = asset0.name;
  entity.asset_1_name = asset1.name;
  entity.amount = parseFloat(new BigNumber(token_price.usd).multipliedBy(amount_balance).toString());
  entity.balance_in = balances_obj[0];
  entity.balance_out = balances_obj[swap_path_obj.length - 1];
  await entity.save();
}

export async function zenlinkLiquidityAdded(event: SubstrateEvent): Promise<void> {
  const { event: { data: [owner, asset_0, asset_1, add_balance_0, add_balance_1, mint_balance_lp] } } = event;
  const blockNumber = (event.extrinsic.block.block.header.number as Compact<BlockNumber>).toBigInt();

  const asset0 = getZenlinkTokenName(JSON.parse(asset_0.toString()).assetIndex)
  const asset1 = getZenlinkTokenName(JSON.parse(asset_1.toString()).assetIndex)
  const entity = new ZenlinkLiquidityCalculation(blockNumber.toString() + '-' + event.idx.toString());
  const token_price = await getPrice(event.extrinsic.block, asset0.coin_id || asset1.coin_id);
  const amount_balance = asset0.coin_id ? toUnitToken((add_balance_0 as Compact<Balance>).toString(), asset0.decimal) : toUnitToken((add_balance_1 as Compact<Balance>).toString(), asset1.decimal)

  entity.block_height = blockNumber;
  entity.block_timestamp = event.extrinsic.block.timestamp;
  entity.event_id = event.idx;
  entity.extrinsic_id = event.extrinsic.idx;
  entity.owner = owner.toString();
  entity.asset_0 = asset_0.toString();
  entity.asset_1 = asset_1.toString();
  entity.asset_0_name = asset0.name;
  entity.asset_1_name = asset1.name;
  entity.amount = parseFloat(new BigNumber(token_price.usd).multipliedBy(amount_balance).toString());
  entity.add_balance_0 = (add_balance_0 as Compact<Balance>).toBigInt();
  entity.add_balance_1 = (add_balance_1 as Compact<Balance>).toBigInt();
  entity.mint_balance_lp = (mint_balance_lp as Compact<Balance>).toBigInt();
  await entity.save();
}

export async function zenlinkLiquidityRemoved(event: SubstrateEvent): Promise<void> {
  const { event: { data: [owner, recipient, asset_0, asset_1, rm_balance_0, rm_balance_1, burn_balance_lp] } } = event;
  const blockNumber = (event.extrinsic.block.block.header.number as Compact<BlockNumber>).toBigInt();

  const asset0 = getZenlinkTokenName(JSON.parse(asset_0.toString()).assetIndex)
  const asset1 = getZenlinkTokenName(JSON.parse(asset_1.toString()).assetIndex)
  const entity = new ZenlinkLiquidityCalculation(blockNumber.toString() + '-' + event.idx.toString());
  const token_price = await getPrice(event.extrinsic.block, asset0.coin_id || asset1.coin_id);
  const amount_balance = asset0.coin_id ? toUnitToken((rm_balance_0 as Compact<Balance>).toString(), asset0.decimal) : toUnitToken((rm_balance_1 as Compact<Balance>).toString(), asset1.decimal)

  entity.block_height = blockNumber;
  entity.block_timestamp = event.extrinsic.block.timestamp;
  entity.event_id = event.idx;
  entity.extrinsic_id = event.extrinsic.idx;
  entity.owner = owner.toString();
  entity.recipient = recipient.toString();
  entity.asset_0 = asset_0.toString();
  entity.asset_1 = asset_1.toString();
  entity.asset_0_name = asset0.name;
  entity.asset_1_name = asset1.name;
  entity.amount = parseFloat(new BigNumber(token_price.usd).multipliedBy(amount_balance).toString());
  entity.rm_balance_0 = (rm_balance_0 as Compact<Balance>).toBigInt();
  entity.rm_balance_1 = (rm_balance_1 as Compact<Balance>).toBigInt();
  entity.burn_balance_lp = (burn_balance_lp as Compact<Balance>).toBigInt();
  await entity.save();
}