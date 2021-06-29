// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Struct } from '@polkadot/types';
import type { Balance } from '@polkadot/types/interfaces/runtime';

/** @name OrmlAccountData */
export interface OrmlAccountData extends Struct {
  readonly free: Balance;
  readonly reserved: Balance;
  readonly frozen: Balance;
}

export type PHANTOM_ASSETS = 'assets';
