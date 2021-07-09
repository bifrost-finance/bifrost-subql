// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Struct, u128, u32, u8 } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces/runtime';

/** @name PairInfo */
export interface PairInfo extends Struct {
  readonly asset0: ZenlinkAssetId;
  readonly asset1: ZenlinkAssetId;
  readonly account: AccountId;
  readonly totalLiquidity: ZenlinkAssetBalance;
  readonly holdingLiquidity: ZenlinkAssetBalance;
  readonly reserve0: ZenlinkAssetBalance;
  readonly reserve1: ZenlinkAssetBalance;
  readonly lpAssetId: ZenlinkAssetId;
}

/** @name ZenlinkAssetBalance */
export interface ZenlinkAssetBalance extends u128 {}

/** @name ZenlinkAssetId */
export interface ZenlinkAssetId extends Struct {
  readonly chain_id: u32;
  readonly asset_type: u8;
  readonly asset_index: u32;
}

export type PHANTOM_ZENLINKPROTOCOL = 'zenlinkProtocol';
