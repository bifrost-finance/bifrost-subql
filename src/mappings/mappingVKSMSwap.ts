import { SubstrateEvent } from "@subql/types";
import { Balance } from "@polkadot/types/interfaces";
import {
  VtokenSwap,
  VtokenSwapRatio,
  VtokenMovrSwap,
  VtokenBncSwap,
} from "../types";

import BigNumber from "bignumber.js";

function getZenlinkTokenName(assetIndex: number): {
  name?: string;
  coin_id?: string;
  decimal?: number;
} {
  switch (assetIndex) {
    case 0:
      return { name: "BNC" };
    case 260:
      return { name: "vKSM" };
    case 257:
      return { name: "vBNC" };
    case 266:
      return { name: "vMOVR" };
    case 516:
      return { name: "KSM" };
    case 522:
      return { name: "MOVR" };
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
  const blockNumber = event.block.block.header.number.toNumber();

  await Promise.all(
    new Array(swap_path_obj.length - 1).fill("").map(async (_, key) => {
      const asset0 = getZenlinkTokenName(swap_path_obj[key].assetIndex);
      const asset1 = getZenlinkTokenName(swap_path_obj[key + 1].assetIndex);

      const isVKSM_KSM =
        (asset0.name === "vKSM" && asset1.name === "KSM") ||
        (asset0.name === "KSM" && asset1.name === "vKSM");

      if (isVKSM_KSM) {
        const vKSMtotalIssuance = await api.query.tokens?.totalIssuance({
          vToken: "KSM",
        });
        const KSMTokenPool = await api.query.vtokenMinting?.tokenPool({
          Token: "KSM",
        });

        const entity = new VtokenSwap(
          blockNumber + "-" + event.idx.toString() + "-" + key.toString()
        );

        entity.block_height = blockNumber;
        entity.block_timestamp = event.block.timestamp;
        entity.event_id = event.idx;
        entity.extrinsic_id = event.idx;
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

        if (isVKSM_KSM) {
          const entity = new VtokenSwapRatio("vKSM_KSM");

          entity.block_height = blockNumber;
          entity.block_timestamp = event.block.timestamp;
          entity.event_id = event.idx;
          entity.asset_0 = swap_path_obj[key];
          entity.asset_1 = swap_path_obj[key + 1];
          entity.asset_0_name = asset0.name;
          entity.asset_1_name = asset1.name;
          entity.balance_in = balances_obj[key];
          entity.balance_out = balances_obj[key + 1];
          entity.ratio =
            asset0.name === "KSM"
              ? new BigNumber(balances_obj[key + 1].toString())
                  .div(balances_obj[key].toString())
                  .toString()
              : new BigNumber(balances_obj[key].toString())
                  .div(balances_obj[key + 1].toString())
                  .toString();
          await entity.save();
        }
      }
    })
  );
}

export async function handleVMOVRSwap(event: SubstrateEvent): Promise<void> {
  const {
    event: {
      data: [owner, recipient, swap_path, balances],
    },
  } = event;
  const swap_path_obj = JSON.parse(swap_path.toString());
  const balances_obj = JSON.parse(balances.toString());
  const blockNumber = event.block.block.header.number.toNumber();

  await Promise.all(
    new Array(swap_path_obj.length - 1).fill("").map(async (_, key) => {
      const asset0 = getZenlinkTokenName(swap_path_obj[key].assetIndex);
      const asset1 = getZenlinkTokenName(swap_path_obj[key + 1].assetIndex);

      const isVMOVR_MOVR =
        (asset0.name === "vMOVR" && asset1.name === "MOVR") ||
        (asset0.name === "MOVR" && asset1.name === "vMOVR");

      if (isVMOVR_MOVR) {
        const vMOVRtotalIssuance = await api.query.tokens?.totalIssuance({
          vToken: "MOVR",
        });
        const MOVRTokenPool = await api.query.vtokenMinting?.tokenPool({
          Token: "MOVR",
        });

        const entity = new VtokenMovrSwap(
          blockNumber + "-" + event.idx.toString() + "-" + key.toString()
        );

        entity.block_height = blockNumber;
        entity.block_timestamp = event.block.timestamp;
        entity.event_id = event.idx;
        entity.extrinsic_id = event.idx;
        entity.owner = owner.toString();
        entity.recipient = recipient.toString();
        entity.asset_0 = swap_path_obj[key];
        entity.asset_1 = swap_path_obj[key + 1];
        entity.asset_0_name = asset0.name;
        entity.asset_1_name = asset1.name;
        entity.balance_in = balances_obj[key];
        entity.balance_out = balances_obj[key + 1];
        entity.vmovr_balance = vMOVRtotalIssuance
          ? (vMOVRtotalIssuance as Balance).toBigInt()
          : BigInt(0);
        entity.movr_balance = MOVRTokenPool
          ? (MOVRTokenPool as Balance).toBigInt()
          : BigInt(0);
        entity.ratio =
          MOVRTokenPool?.toString() === "0" ||
          vMOVRtotalIssuance?.toString() === "0"
            ? "0"
            : new BigNumber(vMOVRtotalIssuance?.toString())
                .div(MOVRTokenPool?.toString())
                .toString();

        await entity.save();

        if (isVMOVR_MOVR) {
          const entity = new VtokenSwapRatio("vMOVR_MOVR");

          entity.block_height = blockNumber;
          entity.block_timestamp = event.block.timestamp;
          entity.event_id = event.idx;
          entity.asset_0 = swap_path_obj[key];
          entity.asset_1 = swap_path_obj[key + 1];
          entity.asset_0_name = asset0.name;
          entity.asset_1_name = asset1.name;
          entity.balance_in = balances_obj[key];
          entity.balance_out = balances_obj[key + 1];
          entity.ratio =
            asset0.name === "MOVR"
              ? new BigNumber(balances_obj[key + 1].toString())
                  .div(balances_obj[key].toString())
                  .toString()
              : new BigNumber(balances_obj[key].toString())
                  .div(balances_obj[key + 1].toString())
                  .toString();
          await entity.save();
        }
      }
    })
  );
}

export async function handleVBNCSwap(event: SubstrateEvent): Promise<void> {
  const {
    event: {
      data: [owner, recipient, swap_path, balances],
    },
  } = event;
  const swap_path_obj = JSON.parse(swap_path.toString());
  const balances_obj = JSON.parse(balances.toString());
  const blockNumber = event.block.block.header.number.toNumber();

  await Promise.all(
    new Array(swap_path_obj.length - 1).fill("").map(async (_, key) => {
      const asset0 = getZenlinkTokenName(swap_path_obj[key].assetIndex);
      const asset1 = getZenlinkTokenName(swap_path_obj[key + 1].assetIndex);

      const isVBNC_BNC =
        (asset0.name === "vBNC" && asset1.name === "BNC") ||
        (asset0.name === "BNC" && asset1.name === "vBNC");

      if (isVBNC_BNC) {
        const vBNCtotalIssuance = await api.query.tokens?.totalIssuance({
          vToken: "BNC",
        });
        const BNCTokenPool = await api.query.vtokenMinting?.tokenPool({
          Native: "BNC",
        });

        const entity = new VtokenBncSwap(
          blockNumber + "-" + event.idx.toString() + "-" + key.toString()
        );

        entity.block_height = blockNumber;
        entity.block_timestamp = event.block.timestamp;
        entity.event_id = event.idx;
        entity.extrinsic_id = event.idx;
        entity.owner = owner.toString();
        entity.recipient = recipient.toString();
        entity.asset_0 = swap_path_obj[key];
        entity.asset_1 = swap_path_obj[key + 1];
        entity.asset_0_name = asset0.name;
        entity.asset_1_name = asset1.name;
        entity.balance_in = balances_obj[key];
        entity.balance_out = balances_obj[key + 1];
        entity.vbnc_balance = vBNCtotalIssuance
          ? (vBNCtotalIssuance as Balance).toBigInt()
          : BigInt(0);
        entity.bnc_balance = BNCTokenPool
          ? (BNCTokenPool as Balance).toBigInt()
          : BigInt(0);
        entity.ratio =
          BNCTokenPool?.toString() === "0" ||
          vBNCtotalIssuance?.toString() === "0"
            ? "0"
            : new BigNumber(vBNCtotalIssuance?.toString())
                .div(BNCTokenPool?.toString())
                .toString();

        await entity.save();

        if (isVBNC_BNC) {
          const entity = new VtokenSwapRatio("vBNC_BNC");

          entity.block_height = blockNumber;
          entity.block_timestamp = event.block.timestamp;
          entity.event_id = event.idx;
          entity.asset_0 = swap_path_obj[key];
          entity.asset_1 = swap_path_obj[key + 1];
          entity.asset_0_name = asset0.name;
          entity.asset_1_name = asset1.name;
          entity.balance_in = balances_obj[key];
          entity.balance_out = balances_obj[key + 1];
          entity.ratio =
            asset0.name === "BNC"
              ? new BigNumber(balances_obj[key + 1].toString())
                  .div(balances_obj[key].toString())
                  .toString()
              : new BigNumber(balances_obj[key].toString())
                  .div(balances_obj[key + 1].toString())
                  .toString();
          await entity.save();
        }
      }
    })
  );
}
