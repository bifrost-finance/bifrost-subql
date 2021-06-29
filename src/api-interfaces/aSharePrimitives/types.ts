// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Enum, i128 } from '@polkadot/types';
import type { ITuple } from '@polkadot/types/types';
import type { LeasePeriod, ParaId } from '@polkadot/types/interfaces/parachains';
import type { Balance, Releases } from '@polkadot/types/interfaces/runtime';

/** @name AmountOf */
export interface AmountOf extends i128 {}

/** @name CurrencyId */
export interface CurrencyId extends Enum {
  readonly isToken: boolean;
  readonly asToken: TokenSymbol;
  readonly isVToken: boolean;
  readonly asVToken: TokenSymbol;
  readonly isNative: boolean;
  readonly asNative: TokenSymbol;
  readonly isStable: boolean;
  readonly asStable: TokenSymbol;
  readonly isVsToken: boolean;
  readonly asVsToken: TokenSymbol;
  readonly isVsBond: boolean;
  readonly asVsBond: ITuple<[TokenSymbol, ParaId, LeasePeriod, LeasePeriod]>;
}

/** @name CurrencyIdOf */
export interface CurrencyIdOf extends CurrencyId {}

/** @name ShareWeight */
export interface ShareWeight extends Balance {}

/** @name StorageVersion */
export interface StorageVersion extends Releases {}

/** @name TAssetBalance */
export interface TAssetBalance extends Balance {}

/** @name TokenSymbol */
export interface TokenSymbol extends Enum {
  readonly isAsg: boolean;
  readonly isAUsd: boolean;
  readonly isDot: boolean;
  readonly isKsm: boolean;
  readonly isEth: boolean;
}

export type PHANTOM_ASHAREPRIMITIVES = 'aSharePrimitives';
