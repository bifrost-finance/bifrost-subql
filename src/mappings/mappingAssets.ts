import { SubstrateExtrinsic, SubstrateEvent, SubstrateBlock } from "@subql/types";
import { BlockNumber, Balance, Moment, AssetId, Token, u16, TokenType, Price, AccountId, CurrencyId, TokenSymbol } from "@bifrost-finance/types/interfaces";
import { VtokenPool, Compact } from '@bifrost-finance/types';
import { getDayStartUnix } from '../common';

import { Transaction } from "../types/models/Transaction";
import { assetsToken } from "../types/models/assetsToken";
import { TransactionDayData } from "../types/models/TransactionDayData";

const ONE_BI = BigInt(1);

function createTransactionDayData(index: string, balance: bigint): TransactionDayData {
  const entity = new TransactionDayData(index);
  entity.transferCount = ONE_BI;
  entity.transferAmount = balance;
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
  const { event: { data: [currency_id_origin, account_from_origin, account_to_origin, balance_origin] } } = event;
  const tokenSymbol = JSON.parse((currency_id_origin as CurrencyId).toString()).Token;
  const balance = (balance_origin as Balance).toBigInt();
  const account_from = (account_from_origin as AccountId).toString();
  const account_to = (account_to_origin as AccountId).toString();
  const blockNumber = (event.extrinsic.block.block.header.number as Compact<BlockNumber>).toNumber();

  const entity = new Transaction(blockNumber.toString() + '-' + event.idx.toString());
  entity.blockHeight = blockNumber;
  entity.eventId = event.idx;
  entity.extrinsicId = event.extrinsic.idx;
  entity.tokenSymbol = tokenSymbol;
  entity.time = event.block.timestamp;
  entity.from = account_from;
  entity.to = account_to;
  entity.amount = balance;
  entity.type = 'transfer';
  await entity.save();

  let record = await TransactionDayData.get(tokenSymbol + '@' + dayStartUnix);
  if (record === undefined || record.transferCount === null) {
    await createTransactionDayData(tokenSymbol + '@' + dayStartUnix, balance).save();
  } else {
    record.transferCount = record.transferCount + ONE_BI;
    record.transferAmount = record.transferAmount + balance;
    await record.save();
  }
}

export async function assetsIssuedEvent(event: SubstrateEvent): Promise<void> {
  const dayStartUnix = getDayStartUnix(event.block);
  const { event: { data: [account_to_origin, currency_id_origin, balance_origin] } } = event;
  const tokenSymbol = JSON.parse((currency_id_origin as CurrencyId).toString()).Token;
  const balance = (balance_origin as Balance).toBigInt();
  const account_to = (account_to_origin as AccountId).toString();
  const blockNumber = (event.extrinsic.block.block.header.number as Compact<BlockNumber>).toNumber();

  const entity = new Transaction(blockNumber.toString() + '-' + event.idx.toString());
  entity.blockHeight = blockNumber;
  entity.eventId = event.idx;
  entity.extrinsicId = event.extrinsic.idx;
  entity.tokenSymbol = tokenSymbol;
  entity.time = event.block.timestamp;
  entity.to = account_to;
  entity.amount = balance;
  entity.type = 'issue';
  await entity.save();

  // const totalIssuanceAmount = ((await api.query.assets.totalIssuance(currency_id_origin as CurrencyId)
  //   .catch(e => { console.log(e) })) as Balance).toBigInt();
  let record = await TransactionDayData.get(tokenSymbol + '@' + dayStartUnix);
  if (record === undefined || record.issueCount === null) {
    let record = new TransactionDayData(tokenSymbol + '@' + dayStartUnix);
    record.tokenSymbol = tokenSymbol;
    record.time = new Date(Number(dayStartUnix) * 1000);
    record.issueCount = ONE_BI;
    record.issueAmount = balance;
    await record.save();
  } else {
    record.issueCount = record.issueCount + ONE_BI;
    record.issueAmount = record.issueAmount + balance;
    await record.save();
  }
}

export async function assetsBlock(block: SubstrateBlock): Promise<void> {
  const tokens = ["BNC", "aUSD", "DOT", "vDOT", "KSM", "vKSM", "ETH", "vETH", "EOS", "vEOS", "IOST", "vIOST"];
}

export async function assetsBurnedEvent(event: SubstrateEvent): Promise<void> {
  const dayStartUnix = getDayStartUnix(event.block);
  const { event: { data: [account_to_origin, currency_id_origin, balance_origin] } } = event;
  const tokenSymbol = JSON.parse((currency_id_origin as CurrencyId).toString()).Token;
  const balance = (balance_origin as Balance).toBigInt();
  const account_to = (account_to_origin as AccountId).toString();
  const blockNumber = (event.extrinsic.block.block.header.number as Compact<BlockNumber>).toNumber();

  const entity = new Transaction(blockNumber.toString() + '-' + event.idx.toString());
  entity.blockHeight = blockNumber;
  entity.eventId = event.idx;
  entity.extrinsicId = event.extrinsic.idx;
  entity.tokenSymbol = tokenSymbol;
  entity.time = event.block.timestamp;
  entity.to = account_to;
  entity.amount = balance;
  entity.type = 'burn';
  await entity.save();

  let record = await TransactionDayData.get(tokenSymbol + '@' + dayStartUnix);
  if (record === undefined || record.burnCount === null) {
    let record = new TransactionDayData(tokenSymbol + '@' + dayStartUnix);
    record.tokenSymbol = tokenSymbol;
    record.time = new Date(Number(dayStartUnix) * 1000);
    record.burnCount = ONE_BI;
    record.burnAmount = balance;
    await record.save();
  } else {
    record.burnCount = record.burnCount + ONE_BI;
    record.burnAmount = record.burnAmount + balance;
    await record.save();
  }
}

export async function vtokenMintMintedVTokenEvent(event: SubstrateEvent): Promise<void> {
  const dayStartUnix = getDayStartUnix(event.block);
  const { event: { data: [account_id_origin, currency_id_origin, balance_origin] } } = event;
  const tokenSymbol = JSON.parse((currency_id_origin as CurrencyId).toString()).Token;
  const balance = (balance_origin as Balance).toBigInt();
  const account_id = (account_id_origin as AccountId).toString();
  const blockNumber = (event.extrinsic.block.block.header.number as Compact<BlockNumber>).toNumber();

  const entity = new Transaction(blockNumber.toString() + '-' + event.idx.toString());
  entity.blockHeight = blockNumber;
  entity.eventId = event.idx;
  entity.extrinsicId = event.extrinsic.idx;
  entity.tokenSymbol = tokenSymbol;
  entity.time = event.block.timestamp;
  entity.to = account_id;
  entity.amount = balance;
  entity.type = 'MintedVToken';
  await entity.save();

  let record = await TransactionDayData.get(tokenSymbol + '@' + dayStartUnix);
  if (record === undefined || record.burnCount === null) {
    let record = new TransactionDayData(tokenSymbol + '@' + dayStartUnix);
    record.tokenSymbol = tokenSymbol;
    record.time = new Date(Number(dayStartUnix) * 1000);
    record.burnCount = ONE_BI;
    record.burnAmount = balance;
    await record.save();
  } else {
    record.burnCount = record.burnCount + ONE_BI;
    record.burnAmount = record.burnAmount + balance;
    await record.save();
  }
}