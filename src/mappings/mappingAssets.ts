import { SubstrateExtrinsic, SubstrateEvent, SubstrateBlock } from "@subql/types";
import { SignedBlock, Balance, Moment, AssetId, Token, u16, TokenType, Price, AccountId } from "@bifrost-finance/types/interfaces";
import { VtokenPool, Compact } from '@bifrost-finance/types';
import { getDayStartUnix } from '../common';

import { assetsTransferred } from "../types/models/assetsTransferred";
import { dailyMintPrice } from "../types/models/dailyMintPrice";
import { assetsToken } from "../types/models/assetsToken";
import { assetsTransferredPrice } from "../types/models/assetsTransferredPrice";
import { assetsIssued } from "../types/models/assetsIssued";

const ONE_BI = BigInt(1);

function createSumassetsTransferred(index: string, balance: bigint): assetsTransferred {
  const entity = new assetsTransferred(index);
  entity.count = BigInt(0);
  entity.amount = balance;
  return entity;
}

export async function assetsCreatedEvent(event: SubstrateEvent): Promise<void> {
  const { event: { data: [id, token1] } } = event;
  let record = new assetsToken(event.extrinsic.block.block.header.hash.toString());

  let token = (await api.query.assets.tokens(id as AssetId)) as Token;
  record.symbol = (token.symbol as AssetId).toString();
  record.precision = (token.precision as u16).toNumber();
  record.total_supply = (token.total_supply as Balance).toBigInt();
  record.token_type = (token.token_type as TokenType).toString();
  await record.save();
}

export async function assetsTransferredEvent(event: SubstrateEvent): Promise<void> {
  const dayStartUnix = getDayStartUnix(event.block);
  const { event: { data: [asset_id_origin, account_from, account_to, balance_origin] } } = event;
  const asset_id_str = (asset_id_origin as AssetId).toString();
  const balance = (balance_origin as Balance).toBigInt();
  let record = await assetsTransferred.get(asset_id_str + '@' + dayStartUnix);
  if (record === undefined) {
    await createSumassetsTransferred(asset_id_str + '@' + dayStartUnix, balance).save();
  } else {
    record.count = record.count + ONE_BI;
    record.amount = record.amount + balance;
    await record.save();
  }

  // let price = ((await api.query.assets.prices(asset_id_origin as AssetId)) as Price).toBigInt();
  // let recordPrice = await assetsTransferredPrice.get(asset_id_str + '@' + dayStartUnix);
  // if (recordPrice === undefined) {
  //   const entity = new assetsTransferredPrice(asset_id_str + '@' + dayStartUnix);
  //   entity.price = price;
  //   await entity.save();
  // } else {
  //   recordPrice.price = price;
  //   await recordPrice.save();
  // }
}

export async function assetsIssuedEvent(event: SubstrateEvent): Promise<void> {
  const { event: { data: [asset_id, account_to, balance] } } = event;
  const asset_id_str = (asset_id as AssetId).toString();
  const dayStartUnix = getDayStartUnix(event.block)

  let record = await assetsIssued.get(asset_id_str + '@' + dayStartUnix);
  if (record === undefined) {
    let record = new assetsIssued(asset_id_str + '@' + dayStartUnix);
    // record.account = (account_to as AccountId).toString();
    record.amount = (balance as Balance).toBigInt();
    await record.save();
  } else {
    record.amount = record.amount + (balance as Balance).toBigInt();
    await record.save();
  }
}