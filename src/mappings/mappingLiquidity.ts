import { SubstrateEvent } from "@subql/types";
import { Balance, BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import { VtokenLiquidity } from "../types";
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

    if (asset0?.name === "vDOT" || asset1?.name === "vDOT") {
      const vDOTtotalIssuance = await api.query.tokens?.totalIssuance({
        vToken2: "0",
      });
      const DOTTokenPool = await api.query.vtokenMinting?.tokenPool({
        Token2: "0",
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

    if (asset0?.name === "vDOT" || asset1?.name === "vDOT") {
      const vDOTtotalIssuance = await api.query.tokens?.totalIssuance({
        vToken2: "0",
      });
      const DOTTokenPool = await api.query.vtokenMinting?.tokenPool({
        Token2: "0",
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
    }
  }
}
