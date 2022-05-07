import { SubstrateEvent } from "@subql/types";
import { Balance, BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import { VtokenSwap, VtokenSwapRatio } from "../types/models";

import BigNumber from "bignumber.js";

function getZenlinkTokenName(assetIndex: number): {
  name?: string;
  coin_id?: string;
  decimal?: number;
} {
  switch (assetIndex) {
    case 260:
      return { name: "vKSM" };
    case 516:
      return { name: "KSM" };
    case 770:
      return { name: "kUSD" };
    default:
      return {};
  }
}
export async function handleVKSMSwap(event: SubstrateEvent): Promise<void> {
  const {
    event: {
      data: [owner, recipient, swap_path, balances],
    },
  } = event;
  const swap_path_obj = JSON.parse(swap_path.toString());
  const balances_obj = JSON.parse(balances.toString());
  const blockNumber = (
    event.extrinsic.block.block.header.number as Compact<BlockNumber>
  ).toBigInt();

  await Promise.all(
    new Array(swap_path_obj.length - 1).fill("").map(async (_, key) => {
      const asset0 = getZenlinkTokenName(swap_path_obj[key].assetIndex);
      const asset1 = getZenlinkTokenName(swap_path_obj[key + 1].assetIndex);

      const isKUSD_KSM =
        (asset0.name === "kUSD" && asset1.name === "KSM") ||
        (asset0.name === "KSM" && asset1.name === "kUSD");

      const isVKSM_KSM =
        (asset0.name === "vKSM" && asset1.name === "KSM") ||
        (asset0.name === "KSM" && asset1.name === "vKSM");

      if (isKUSD_KSM || isVKSM_KSM) {
        const vKSMtotalIssuance = await api.query.tokens?.totalIssuance({
          vToken: "KSM",
        });
        const KSMTokenPool = await api.query.vtokenMinting?.tokenPool({
          Token: "KSM",
        });

        const entity = new VtokenSwap(
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
        entity.balance_in = balances_obj[key];
        entity.balance_out = balances_obj[key + 1];
        entity.vksm_balance = vKSMtotalIssuance
          ? (vKSMtotalIssuance as Balance).toBigInt()
          : BigInt(0);
        entity.ksm_balance = KSMTokenPool
          ? (KSMTokenPool as Balance).toBigInt()
          : BigInt(0);
        entity.ratio =
          KSMTokenPool?.toString() === "0" ||
          vKSMtotalIssuance?.toString() === "0"
            ? "0"
            : new BigNumber(vKSMtotalIssuance?.toString())
                .div(KSMTokenPool?.toString())
                .toString();

        await entity.save();

        if (isKUSD_KSM) {
          const entity = new VtokenSwapRatio("kUSD_KSM");

          entity.block_height = blockNumber;
          entity.block_timestamp = event.extrinsic.block.timestamp;
          entity.event_id = event.idx;
          entity.asset_0 = swap_path_obj[key];
          entity.asset_1 = swap_path_obj[key + 1];
          entity.asset_0_name = asset0.name;
          entity.asset_1_name = asset1.name;
          entity.balance_in = balances_obj[key];
          entity.balance_out = balances_obj[key + 1];
          entity.ratio = new BigNumber(balances_obj[key + 1].toString())
            .div(balances_obj[key].toString())
            .toString();
          await entity.save();
        }

        if (isVKSM_KSM) {
          const entity = new VtokenSwapRatio("vKSM_KSM");

          entity.block_height = blockNumber;
          entity.block_timestamp = event.extrinsic.block.timestamp;
          entity.event_id = event.idx;
          entity.asset_0 = swap_path_obj[key];
          entity.asset_1 = swap_path_obj[key + 1];
          entity.asset_0_name = asset0.name;
          entity.asset_1_name = asset1.name;
          entity.balance_in = balances_obj[key];
          entity.balance_out = balances_obj[key + 1];
          entity.ratio = entity.ratio =
            asset0.name === "KSM"
              ? new BigNumber(balances_obj[1].toString())
                  .div(balances_obj[key].toString())
                  .toString()
              : new BigNumber(balances_obj[0].toString())
                  .div(balances_obj[key + 1].toString())
                  .toString();
          await entity.save();
        }
      }
    })
  );
}
