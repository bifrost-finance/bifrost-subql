// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Struct, u32 } from '@polkadot/types';
import type { Balance, BlockNumber } from '@polkadot/types/interfaces/runtime';

/** @name MaxLocksOf */
export interface MaxLocksOf extends u32 {}

/** @name VestingInfo */
export interface VestingInfo extends Struct {
  readonly locked: Balance;
  readonly per_block: Balance;
  readonly starting_block: BlockNumber;
}

export type PHANTOM_VESTING = 'vesting';
