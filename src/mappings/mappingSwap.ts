import { SubstrateEvent } from "@subql/types";
import { Balance, BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import { VtokenSwap, VtokenSwapRatio, VtokenGlmrSwap } from "../types";

import BigNumber from "bignumber.js";

function getZenlinkTokenName(assetIndex: number): {
  name?: string;
  coin_id?: string;
  decimal?: number;
} {
  switch (assetIndex) {
    case 2048:
      return { name: "DOT" };
    case 2304:
      return { name: "vDOT" };
    case 2049:
      return { name: "GLMR" };
    case 2305:
      return { name: "vGLMR" };
    case 2052:
      return { name: "FIL" };
    case 2308:
      return { name: "vFIL" };
    case 2051:
      return { name: "ASTR" };
    case 2307:
      return { name: "vASTR" };
    default:
      return {};
  }
}
export async function handleVDOTSwap(event: SubstrateEvent): Promise<void> {
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

      const isVDOT_DOT =
        (asset0.name === "vDOT" && asset1.name === "DOT") ||
        (asset0.name === "DOT" && asset1.name === "vDOT");

      if (isVDOT_DOT) {
        const vDOTtotalIssuance = await api.query.tokens?.totalIssuance({
          vToken2: "0",
        });
        const DOTTokenPool = await api.query.vtokenMinting?.tokenPool({
          Token2: "0",
        });

        const entity = new VtokenSwap(
          blockNumber.toString() +
          "-" +
          event.idx.toString() +
          "-" +
          key.toString()
        );

        entity.block_height = blockNumber;
        entity.block_timestamp = event.block.timestamp;
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
        entity.vdot_balance = vDOTtotalIssuance
          ? (vDOTtotalIssuance as Balance).toBigInt()
          : BigInt(0);
        entity.dot_balance = DOTTokenPool
          ? (DOTTokenPool as Balance).toBigInt()
          : BigInt(0);
        entity.ratio =
          DOTTokenPool?.toString() === "0" ||
            vDOTtotalIssuance?.toString() === "0"
            ? "0"
            : new BigNumber(vDOTtotalIssuance?.toString())
              .div(DOTTokenPool?.toString())
              .toString();

        await entity.save();

        if (isVDOT_DOT) {
          const entity = new VtokenSwapRatio("vDOT_DOT");

          entity.block_height = blockNumber;
          entity.block_timestamp = event.block.timestamp;
          entity.event_id = event.idx;
          entity.asset_0 = swap_path_obj[key];
          entity.asset_1 = swap_path_obj[key + 1];
          entity.asset_0_name = asset0.name;
          entity.asset_1_name = asset1.name;
          entity.balance_in = balances_obj[key];
          entity.balance_out = balances_obj[key + 1];
          entity.ratio = entity.ratio =
            asset0.name === "DOT"
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

export async function handleVGLMRSwap(event: SubstrateEvent): Promise<void> {
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

      const isVGLMR_GLMR =
        (asset0?.name === "GLMR" && asset1?.name === "vGLMR") ||
        (asset0?.name === "vGLMR" && asset1?.name === "GLMR");

      if (isVGLMR_GLMR) {
        const vGLMRtotalIssuance = await api.query.tokens?.totalIssuance({
          vToken2: "1",
        });
        const GLMRTokenPool = await api.query.vtokenMinting?.tokenPool({
          Token2: "1",
        });

        const entity = new VtokenGlmrSwap(
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
        entity.vglmr_balance = vGLMRtotalIssuance
          ? (vGLMRtotalIssuance as Balance).toBigInt()
          : BigInt(0);
        entity.glmr_balance = GLMRTokenPool
          ? (GLMRTokenPool as Balance).toBigInt()
          : BigInt(0);
        entity.ratio =
          GLMRTokenPool?.toString() === "0" ||
            vGLMRtotalIssuance?.toString() === "0"
            ? "0"
            : new BigNumber(vGLMRtotalIssuance?.toString())
              .div(GLMRTokenPool?.toString())
              .toString();

        await entity.save();

        if (isVGLMR_GLMR) {
          const entity = new VtokenSwapRatio("vGLMR_GLMR");

          entity.block_height = blockNumber;
          entity.block_timestamp = event.block.timestamp;
          entity.event_id = event.idx;
          entity.asset_0 = swap_path_obj[key];
          entity.asset_1 = swap_path_obj[key + 1];
          entity.asset_0_name = asset0.name;
          entity.asset_1_name = asset1.name;
          entity.balance_in = balances_obj[key];
          entity.balance_out = balances_obj[key + 1];
          entity.ratio = entity.ratio =
            asset0.name === "GLMR"
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

export async function handleVASTRSwap(event: SubstrateEvent): Promise<void> {
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

        const isVASTR_ASTR =
            (asset0?.name === "ASTR" && asset1?.name === "vASTR") ||
            (asset0?.name === "vASTR" && asset1?.name === "ASTR");


        if (isVASTR_ASTR) {
          const entity = new VtokenSwapRatio("vASTR_ASTR");

          entity.block_height = blockNumber;
          entity.block_timestamp = event.block.timestamp;
          entity.event_id = event.idx;
          entity.asset_0 = swap_path_obj[key];
          entity.asset_1 = swap_path_obj[key + 1];
          entity.asset_0_name = asset0.name;
          entity.asset_1_name = asset1.name;
          entity.balance_in = balances_obj[key];
          entity.balance_out = balances_obj[key + 1];
          entity.ratio = entity.ratio =
              asset0.name === "ASTR"
                  ? new BigNumber(balances_obj[key + 1].toString())
                      .div(balances_obj[key].toString())
                      .toString()
                  : new BigNumber(balances_obj[key].toString())
                      .div(balances_obj[key + 1].toString())
                      .toString();
          await entity.save();
        }
      })
  );
}

export async function handleVFILSwap(event: SubstrateEvent): Promise<void> {
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

      const isVFIL_FIL =
        (asset0?.name === "FIL" && asset1?.name === "vFIL") ||
        (asset0?.name === "vFIL" && asset1?.name === "FIL");


      if (isVFIL_FIL) {
        const entity = new VtokenSwapRatio("vFIL_FIL");

        entity.block_height = blockNumber;
        entity.block_timestamp = event.block.timestamp;
        entity.event_id = event.idx;
        entity.asset_0 = swap_path_obj[key];
        entity.asset_1 = swap_path_obj[key + 1];
        entity.asset_0_name = asset0.name;
        entity.asset_1_name = asset1.name;
        entity.balance_in = balances_obj[key];
        entity.balance_out = balances_obj[key + 1];
        entity.ratio = entity.ratio =
          asset0.name === "FIL"
            ? new BigNumber(balances_obj[key + 1].toString())
              .div(balances_obj[key].toString())
              .toString()
            : new BigNumber(balances_obj[key].toString())
              .div(balances_obj[key + 1].toString())
              .toString();
        await entity.save();
      }
    })
  );
}
