// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Struct, u128, u32, u8 } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces/runtime';

/** @name AssetBalance */
export interface AssetBalance extends u128 {}

/** @name AssetId */
export interface AssetId extends Struct {
  readonly chain_id: u32;
  readonly asset_type: u8;
  readonly asset_index: u32;
}

/** @name PairInfo */
export interface PairInfo extends Struct {
  readonly asset0: AssetId;
  readonly asset1: AssetId;
  readonly account: AccountId;
  readonly totalLiquidity: AssetBalance;
  readonly holdingLiquidity: AssetBalance;
  readonly reserve0: AssetBalance;
  readonly reserve1: AssetBalance;
  readonly lpAssetId: AssetId;
}

export type PHANTOM_ZENLINKPROTOCOL = 'zenlinkProtocol';
