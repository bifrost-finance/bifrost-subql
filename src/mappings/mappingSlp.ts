import { SubstrateEvent } from "@subql/types";
import { Balance } from "@polkadot/types/interfaces";
import BigNumber from "bignumber.js";

import { StakingErapaid, StakingReward } from "../types";

export async function handleStakingErapaid(
  event: SubstrateEvent
): Promise<void> {
  const {
    event: {
      data: [blockNumber, index, number_collators, validator_payout],
    },
  } = event;

  const record = new StakingErapaid(`${blockNumber}-${event.idx.toString()}`);
  const candidateInfo =
    await api.query.parachainStaking.candidateInfo.entries();
  const awardedPts = await api.query.parachainStaking.awardedPts.entries();

  const total = (await api.query.parachainStaking.total()).toString();

  const rewardPerRound = 180000000000000;
  const apy = new BigNumber(rewardPerRound)
    .div(total)
    .multipliedBy(12 * 365)
    .toString();
  record.event_id = event.idx;
  record.block_height = blockNumber.toString();
  record.block_timestamp = event.block.timestamp;
  record.era_index = index.toString();
  record.validator_payout = (validator_payout as Balance)?.toBigInt();
  record.number_collators = number_collators.toString();
  record.candidate_info = JSON.stringify(
    candidateInfo.map((item) => ({
      account: item[0].toHuman(),
      value: item[1].toHuman(),
    }))
  );
  record.awarded = JSON.stringify(
    awardedPts.map((item) => ({
      account: item[0].toHuman()[1],
      value: item[1].toString(),
    }))
  );
  record.total = total;

  record.apy = apy;

  await record.save();
}

export async function handleStakingReward(
    event: SubstrateEvent
): Promise<void> {
  const {
    event: {
      data: [account, rewards],
    },
  } = event;
  const blockNumber = event.block.block.header.number.toString();
  const record = StakingReward.create({
    id: `${blockNumber}-${account}`,
    block_height: blockNumber,
    account: account.toString(),
    rewards: (rewards as Balance)?.toBigInt(),
  })

  await record.save();
}
