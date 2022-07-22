import { SubstrateEvent } from "@subql/types";
import { Balance, BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import { VtokenLiquidity, VtokenMovrLiquidity } from "../types";
import BigNumber from "bignumber.js";

function getZenlinkTokenName(assetIndex: number): {
  name?: string;
  coin_id?: string;
  decimal?: number;
} {
  switch (assetIndex) {
    case 260:
      return { name: "vKSM" };
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
export async function handleVtokenLiquidity(
  event: SubstrateEvent
): Promise<void> {
  const {
    event: { data, method },
  } = event;

  if (method.toString() === "LiquidityAdded") {
    const [owner, asset_0, asset_1, balance_0, balance_1, balance_lp] = data;

    const asset_0_obj = JSON.parse(asset_0.toString());
    const asset_1_obj = JSON.parse(asset_1.toString());
    const asset0 = getZenlinkTokenName(asset_0_obj?.assetIndex);
    const asset1 = getZenlinkTokenName(asset_1_obj?.assetIndex);
    const blockNumber = (
      event.block.block.header.number as Compact<BlockNumber>
    ).toBigInt();

    if (asset0?.name === "vKSM" || asset1?.name === "vKSM") {
      const vKSMtotalIssuance = await api.query.tokens?.totalIssuance({
        vToken: "KSM",
      });
      const KSMTokenPool = await api.query.vtokenMinting?.tokenPool({
        Token: "KSM",
      });

      const entity = new VtokenLiquidity(
        blockNumber.toString() + "-" + event.idx.toString()
      );
      entity.block_height = blockNumber;
      entity.block_timestamp = event.block.timestamp;
      entity.method = method.toString();
      entity.owner = owner.toString();
      entity.asset_0 = asset0.name;
      entity.asset_1 = asset1.name;
      entity.balance_0 = (balance_0 as Balance).toBigInt();
      entity.balance_1 = (balance_1 as Balance).toBigInt();
      entity.balance_lp = (balance_lp as Balance).toBigInt();
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
    }

    if (asset0?.name === "vMOVR" || asset1?.name === "vMOVR") {
      const vMOVRtotalIssuance = await api.query.tokens?.totalIssuance({
        vToken: "MOVR",
      });
      const MOVRTokenPool = await api.query.vtokenMinting?.tokenPool({
        Token: "MOVR",
      });

      const entity = new VtokenMovrLiquidity(
        blockNumber.toString() + "-" + event.idx.toString()
      );
      entity.block_height = blockNumber;
      entity.block_timestamp = event.block.timestamp;
      entity.method = method.toString();
      entity.owner = owner.toString();
      entity.asset_0 = asset0.name;
      entity.asset_1 = asset1.name;
      entity.balance_0 = (balance_0 as Balance).toBigInt();
      entity.balance_1 = (balance_1 as Balance).toBigInt();
      entity.balance_lp = (balance_lp as Balance).toBigInt();
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
    }
  } else {
    const [
      owner,
      recipient,
      asset_0,
      asset_1,
      balance_0,
      balance_1,
      balance_lp,
    ] = data;

    const asset_0_obj = JSON.parse(asset_0.toString());
    const asset_1_obj = JSON.parse(asset_1.toString());
    const asset0 = getZenlinkTokenName(asset_0_obj?.assetIndex);
    const asset1 = getZenlinkTokenName(asset_1_obj?.assetIndex);
    const blockNumber = (
      event.block.block.header.number as Compact<BlockNumber>
    ).toBigInt();

    if (asset0?.name === "vKSM" || asset1?.name === "vKSM") {
      const vKSMtotalIssuance = await api.query.tokens?.totalIssuance({
        vToken: "KSM",
      });
      const KSMTokenPool = await api.query.vtokenMinting?.tokenPool({
        Token: "KSM",
      });

      const entity = new VtokenLiquidity(
        blockNumber.toString() + "-" + event.idx.toString()
      );
      entity.block_height = blockNumber;
      entity.block_timestamp = event.block.timestamp;
      entity.method = method.toString();
      entity.owner = owner.toString();
      entity.asset_0 = asset0.name;
      entity.asset_1 = asset1.name;
      entity.balance_0 = (balance_0 as Balance).toBigInt();
      entity.balance_1 = (balance_1 as Balance).toBigInt();
      entity.balance_lp = (balance_lp as Balance).toBigInt();
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
    }

    if (asset0?.name === "vMOVR" || asset1?.name === "vMOVR") {
      const vMOVRtotalIssuance = await api.query.tokens?.totalIssuance({
        vToken: "MOVR",
      });
      const MOVRTokenPool = await api.query.vtokenMinting?.tokenPool({
        Token: "MOVR",
      });

      const entity = new VtokenMovrLiquidity(
        blockNumber.toString() + "-" + event.idx.toString()
      );
      entity.block_height = blockNumber;
      entity.block_timestamp = event.block.timestamp;
      entity.method = method.toString();
      entity.owner = owner.toString();
      entity.asset_0 = asset0.name;
      entity.asset_1 = asset1.name;
      entity.balance_0 = (balance_0 as Balance).toBigInt();
      entity.balance_1 = (balance_1 as Balance).toBigInt();
      entity.balance_lp = (balance_lp as Balance).toBigInt();
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
    }
  }
}
