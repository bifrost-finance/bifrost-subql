import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { Balance, BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import BigNumber from "bignumber.js";

import {
  VtokenMintingInfo,
  VtokenMintingMinted,
  VtokenMintingRedeemed,
  VtokenMintingRebondedByUnlockId,
  VtokenRedeemedSuccess,
  VtokenSwapRatio,
  VtokenMintingRatio,
  VtokenMintingGlmrRatio,
  VtokenMintingFilRatio,
} from "../types";

export async function vtokenMinting(block: SubstrateBlock): Promise<void> {
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  ).toBigInt();
  const vtokenMintingEvents = block.events.filter(
    (e) => e.event.section === "vtokenMinting"
  ) as unknown as SubstrateEvent[];

  for (let vtokenMintingEvent of vtokenMintingEvents) {
    const {
      event: { data, method },
    } = vtokenMintingEvent;
    const record = new VtokenMintingInfo(
      blockNumber.toString() + "-" + vtokenMintingEvent.idx.toString()
    );

    record.block_height = blockNumber;
    record.block_timestamp = block.timestamp;
    record.method = method.toString();
    record.data = data.toString();
    await record.save();
  }

  if (new BigNumber(blockNumber.toString()).modulo(20).toNumber() === 0) {
    const vDOTtotalIssuance = await api.query.tokens?.totalIssuance({
      vToken2: "0",
    });
    const DOTTokenPool = await api.query.vtokenMinting?.tokenPool({
      Token2: "0",
    });

    const record = new VtokenMintingRatio(blockNumber.toString());
    const swapVDOTDOTRecord = await VtokenSwapRatio.get("vDOT_DOT");

    record.block_height = blockNumber;
    record.block_timestamp = block.timestamp;
    record.vdot_balance = vDOTtotalIssuance
      ? (vDOTtotalIssuance as Balance).toBigInt()
      : BigInt(0);
    record.dot_balance = DOTTokenPool
      ? (DOTTokenPool as Balance).toBigInt()
      : BigInt(0);
    record.ratio =
      DOTTokenPool?.toString() === "0" || vDOTtotalIssuance?.toString() === "0"
        ? "0"
        : new BigNumber(vDOTtotalIssuance?.toString())
            .div(DOTTokenPool?.toString())
            .toString();
    record.vdot_dot_ratio = swapVDOTDOTRecord?.ratio || "0";

    await record.save();

    const vGLMRtotalIssuance = await api.query.tokens?.totalIssuance({
      vToken2: "1",
    });
    const GLMRTokenPool = await api.query.vtokenMinting?.tokenPool({
      Token2: "1",
    });

    const glmrRecord = new VtokenMintingGlmrRatio(blockNumber.toString());
    const swapVGLMRGLMRRecord = await VtokenSwapRatio.get("vGLMR_GLMR");

    glmrRecord.block_height = blockNumber;
    glmrRecord.block_timestamp = block.timestamp;
    glmrRecord.vglmr_balance = vGLMRtotalIssuance
      ? (vGLMRtotalIssuance as Balance).toBigInt()
      : BigInt(0);
    glmrRecord.glmr_balance = GLMRTokenPool
      ? (GLMRTokenPool as Balance).toBigInt()
      : BigInt(0);
    glmrRecord.ratio =
      GLMRTokenPool?.toString() === "0" ||
      vGLMRtotalIssuance?.toString() === "0"
        ? "0"
        : new BigNumber(vGLMRtotalIssuance?.toString())
            .div(GLMRTokenPool?.toString())
            .toString();
    glmrRecord.vglmr_glmr_ratio = swapVGLMRGLMRRecord?.ratio || "0";

    await glmrRecord.save();

    const vFILtotalIssuance = await api.query.tokens?.totalIssuance({
      vToken2: "4",
    });
    const FILTokenPool = await api.query.vtokenMinting?.tokenPool({
      Token2: "4",
    });

    const filRecord = new VtokenMintingFilRatio(blockNumber.toString());
    const swapVFILFILRecord = await VtokenSwapRatio.get("vFIL_FIL");

    filRecord.block_height = blockNumber;
    filRecord.block_timestamp = block.timestamp;
    filRecord.vfil_balance = vFILtotalIssuance
      ? (vFILtotalIssuance as Balance).toBigInt()
      : BigInt(0);
    filRecord.fil_balance = FILTokenPool
      ? (FILTokenPool as Balance).toBigInt()
      : BigInt(0);
    filRecord.ratio =
      FILTokenPool?.toString() === "0" || vFILtotalIssuance?.toString() === "0"
        ? "0"
        : new BigNumber(vFILtotalIssuance?.toString())
            .div(FILTokenPool?.toString())
            .toString();
    filRecord.vfil_fil_ratio = swapVFILFILRecord?.ratio || "0";

    await filRecord.save();
  }
  return;
}

export async function handleVtokenMintingMinted(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = (
    event.block.block.header.number as Compact<BlockNumber>
  ).toBigInt();

  const {
    event: {
      data: [account, token, balance_dot, balance_vdot],
    },
  } = event;

  const record = new VtokenMintingMinted(
    blockNumber.toString() + "-" + event.idx.toString()
  );

  record.block_height = blockNumber;
  record.block_timestamp = event.block.timestamp;
  record.token = token.toString();
  record.account = account.toString();
  record.balance_dot = (balance_dot as Balance).toBigInt();
  record.balance_vdot = (balance_vdot as Balance).toBigInt();

  await record.save();
}

export async function handleVtokenMintingRebondedByUnlockId(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = (
    event.block.block.header.number as Compact<BlockNumber>
  ).toBigInt();

  const {
    event: {
      data: [account, token, balanceDOT, balancevDOT],
    },
  } = event;

  const record = new VtokenMintingRebondedByUnlockId(
    blockNumber.toString() + "-" + event.idx.toString()
  );

  record.block_height = blockNumber;
  record.block_timestamp = event.block.timestamp;
  record.token = token.toString();
  record.account = account.toString();
  record.balance_dot = (balanceDOT as Balance).toBigInt();
  record.balance_vdot = (balancevDOT as Balance).toBigInt();
  await record.save();
}

export async function handleVtokenMintingRedeemed(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = (
    event.block.block.header.number as Compact<BlockNumber>
  ).toBigInt();

  const {
    event: {
      data: [account, token, balanceDOT, balancevDOT],
    },
  } = event;

  const record = new VtokenMintingRedeemed(
    blockNumber.toString() + "-" + event.idx.toString()
  );

  record.block_height = blockNumber;
  record.block_timestamp = event.block.timestamp;
  record.token = token.toString();
  record.account = account.toString();
  record.balance_dot = (balanceDOT as Balance).toBigInt();
  record.balance_vdot = (balancevDOT as Balance).toBigInt();

  await record.save();
}

export async function handleVtokenRedeemedSuccess(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = (
    event.block.block.header.number as Compact<BlockNumber>
  ).toBigInt();

  const {
    event: {
      data: [id, token, account, balance],
    },
  } = event;

  const vDOTtotalIssuance = await api.query.tokens?.totalIssuance({
    vToken2: "0",
  });
  const DOTTokenPool = await api.query.vtokenMinting?.tokenPool({
    Token2: "0",
  });

  const record = new VtokenRedeemedSuccess(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.block_timestamp = event.block.timestamp;
  record.redeem_id = id.toString();
  record.token = token.toString();
  record.account = account.toString();
  record.balance = (balance as Balance).toBigInt();
  record.vdot_balance = vDOTtotalIssuance
    ? (vDOTtotalIssuance as Balance).toBigInt()
    : BigInt(0);
  record.dot_balance = DOTTokenPool
    ? (DOTTokenPool as Balance).toBigInt()
    : BigInt(0);
  record.ratio =
    DOTTokenPool?.toString() === "0" || vDOTtotalIssuance?.toString() === "0"
      ? "0"
      : new BigNumber(vDOTtotalIssuance?.toString())
          .div(DOTTokenPool?.toString())
          .toString();

  await record.save();
}
