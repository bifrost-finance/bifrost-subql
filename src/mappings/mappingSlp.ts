import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { Balance, BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import BigNumber from "bignumber.js";
import { isNull } from "lodash";

import { SlpInfo, FarmingInfo, StakingErapaid } from "../types";

export async function handleSlp(block: SubstrateBlock): Promise<void> {
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  ).toBigInt();
  const slpEvents = block.events.filter(
    (e) => e.event.section === "slp"
  ) as unknown as SubstrateEvent[];

  for (let slpEvent of slpEvents) {
    const {
      event: { data, method },
    } = slpEvent;
    const record = new SlpInfo(
      blockNumber.toString() + "-" + slpEvent.idx.toString()
    );

    record.block_height = blockNumber;
    record.block_timestamp = block.timestamp;
    record.method = method.toString();
    record.data = data.toString();

    await record.save();
  }
}

export async function handleFarmingApy(block: SubstrateBlock): Promise<void> {
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  ).toBigInt();

  if (new BigNumber(blockNumber.toString()).modulo(300).toNumber() === 0) {
    const result = await api.query.farming.poolInfos.entries();

    const poolInfos = await Promise.all(
      result.map(async (item) => {
        let gaugePoolInfos = null;
        if (!isNull(JSON.parse(JSON.stringify(item[1].toJSON())).gauge)) {
          gaugePoolInfos = (
            await api.query.farming.gaugePoolInfos(
              JSON.parse(JSON.stringify(item[1].toJSON())).gauge
            )
          ).toJSON();
        }
        const poolId = item[0].toHuman()[0];

        return {
          poolId,
          ...JSON.parse(JSON.stringify(item[1].toJSON())),
          gaugePoolInfos,
        };
      })
    );
    const record = new FarmingInfo(blockNumber.toString());

    record.block_height = blockNumber;
    record.block_timestamp = block.timestamp;
    record.pool_infos = JSON.stringify(poolInfos);

    await record.save();
  }
}

export async function handleStakingErapaid(
  event: SubstrateEvent
): Promise<void> {
  const {
    event: {
      data: [blockNumber, index, number_collators, validator_payout],
    },
  } = event;

  const record = new StakingErapaid(`${blockNumber}-${event.idx.toString()}`);

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
  record.candidate_info = "";
  record.apy = apy;

  await record.save();
}
