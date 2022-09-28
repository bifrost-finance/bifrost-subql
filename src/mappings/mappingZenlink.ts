import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import BigNumber from "bignumber.js";
import { ZenlinkInfo, ZenlinkLiquidityCalculation } from "../types";
import { getPrice, getZenlinkTokenName, toUnitToken } from "../common";

export async function zenlink(block: SubstrateBlock): Promise<void> {
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  )?.toBigInt();

  const zenlinkEvents = block.events.filter(
    (e) => e.event.section === "zenlinkProtocol"
  ) as SubstrateEvent[];
  for (let zenlinkEvent of zenlinkEvents) {
    const {
      event: { data, section, method },
    } = zenlinkEvent;
    const record = new ZenlinkInfo(
      blockNumber.toString() + "-" + zenlinkEvent.idx.toString()
    );
    record.block_height = blockNumber;
    record.block_timestamp = block.timestamp;
    record.method = method.toString();
    record.data = data.toString();
    await record.save();
  }
  return;
}

export async function zenlinkAssetSwap(event: SubstrateEvent): Promise<void> {
  const {
    event: {
      data: [owner, recipient, swap_path, balances],
    },
  } = event;
  const swap_path_obj = JSON.parse(swap_path.toString());
  const balances_obj = JSON.parse(balances.toString());
  const blockNumber = (
    event.extrinsic.block.block.header.number as Compact<BlockNumber>
  )?.toBigInt();

  await Promise.all(
    new Array(swap_path_obj.length - 1).fill("").map(async (_, key) => {
      const asset0 = getZenlinkTokenName(swap_path_obj[key].assetIndex);
      const asset1 = getZenlinkTokenName(swap_path_obj[key + 1].assetIndex);
      const token_price = await getPrice(
        event.extrinsic.block,
        asset0.coin_id || asset1.coin_id
      );
      const amount_balance = asset0.coin_id
        ? toUnitToken(balances_obj[key], asset0.decimal)
        : toUnitToken(balances_obj[key + 1], asset1.decimal);
      const entity = new ZenlinkLiquidityCalculation(
        blockNumber.toString() +
          "-" +
          event.idx.toString() +
          "-" +
          key.toString()
      );

      entity.block_height = blockNumber;
      entity.block_timestamp = event.extrinsic.block.timestamp;
      entity.event_id = event.idx;
      entity.extrinsic_id = event.extrinsic.idx;
      entity.owner = owner.toString();
      entity.recipient = recipient.toString();
      entity.asset_0 = swap_path_obj[key];
      entity.asset_1 = swap_path_obj[key + 1];
      entity.asset_0_name = asset0.name;
      entity.asset_1_name = asset1.name;
      entity.amount = parseFloat(
        new BigNumber(token_price.usd).multipliedBy(amount_balance).toString()
      );
      entity.balance_in = balances_obj[key];
      entity.balance_out = balances_obj[key + 1];
      await entity.save();
    })
  );
}
