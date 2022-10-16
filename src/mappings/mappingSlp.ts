import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import BigNumber from "bignumber.js";
import { isNull } from "lodash";

import { SlpInfo, FarmingInfo } from "../types";

export async function handleSlp(block: SubstrateBlock): Promise<void> {
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  ).toBigInt();
  const slpEvents = block.events.filter(
    (e) => e.event.section === "slp"
  ) as SubstrateEvent[];

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
