// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Struct } from '@polkadot/types';
import type { AccountId, Balance } from '@polkadot/types/interfaces/runtime';

/** @name RewardRecord */
export interface RewardRecord extends Struct {
  readonly account_id: AccountId;
  readonly record_amount: Balance;
}

export type PHANTOM_STAKINGREWARD = 'stakingReward';
