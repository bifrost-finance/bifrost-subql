import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { BlockNumber, Balance, MessageId } from "@polkadot/types/interfaces";
import { Compact } from '@polkadot/types';
import type { ParaId } from '@polkadot/types/interfaces/parachains';
import type { AccountIdOf, BalanceOf } from '@polkadot/types/interfaces/runtime';
import { CurrencyId, TokenSymbol } from "@bifrost-finance/types/interfaces";
import { CurrenciesDeposited } from '../types/models/CurrenciesDeposited';
import { XtokensTransferred } from '../types/models/XtokensTransferred';
import { BalancesTransfer } from '../types/models/BalancesTransfer';

export async function handleXtokensTransferred(event: SubstrateEvent): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const { event: { data: [account, currency, balance, multilocation] } } = event;
  const record = new XtokensTransferred(blockNumber.toString() + '-' + event.idx.toString());
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic.idx;
  record.block_timestamp = event.block.timestamp;
  record.account = account.toString();
  record.currency = (currency as CurrencyId).toString();
  record.balance = (balance as Balance).toBigInt();
  record.multilocation = multilocation.toString();
  await record.save();
}

export async function handleCurrenciesDeposited(event: SubstrateEvent): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const { event: { data: [currency, account, balance] } } = event;
  const record = new CurrenciesDeposited(blockNumber.toString() + '-' + event.idx.toString());
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic.idx;
  record.block_timestamp = event.block.timestamp;
  record.account = account.toString();
  record.currency = (currency as CurrencyId).toString();
  record.balance = (balance as Balance).toBigInt();
  await record.save();
}

export async function handleBalancesTransfer(event: SubstrateEvent): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const { event: { data: [from, to, balance] } } = event;
  const record = new BalancesTransfer(blockNumber.toString() + '-' + event.idx.toString());
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic.idx;
  record.block_timestamp = event.block.timestamp;
  record.from = from.toString();
  record.to = to.toString();
  record.balance = (balance as Balance).toBigInt();
  await record.save();
}