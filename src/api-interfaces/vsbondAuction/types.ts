// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Enum, Struct, u64 } from '@polkadot/types';
import type { AccountIdOf, BalanceOf } from '@polkadot/types/interfaces/runtime';
import type { CurrencyIdOf } from 'bifrost-subql/api-interfaces/aSharePrimitives';

/** @name OrderId */
export interface OrderId extends u64 {}

/** @name OrderInfo */
export interface OrderInfo extends Struct {
  readonly owner: AccountIdOf;
  readonly currency_sold: CurrencyIdOf;
  readonly amount_sold: BalanceOf;
  readonly currency_expected: CurrencyIdOf;
  readonly amount_expected: BalanceOf;
  readonly order_id: OrderId;
  readonly order_state: OrderState;
}

/** @name OrderState */
export interface OrderState extends Enum {
  readonly isInTrade: boolean;
  readonly isRevoked: boolean;
  readonly isClinchd: boolean;
}

export type PHANTOM_VSBONDAUCTION = 'vsbondAuction';
