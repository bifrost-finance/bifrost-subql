import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { Balance, BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import BigNumber from "bignumber.js";

import {
  VtokenSwapRatio,
  VtokenMintingInfo,
  VtokenMintingMinted,
  VtokenMintingRatio,
  VtokenMintingRedeemed,
  VtokenMintingRebondedByUnlockId,
  VtokenRedeemedSuccess,
  VtokenMintingMovrRatio,
  VtokenMintingBncRatio,
  VtokenMintingPhaRatio,
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
    const vKSMtotalIssuance = await api.query.tokens?.totalIssuance({
      vToken: "KSM",
    });
    const KSMTokenPool = await api.query.vtokenMinting?.tokenPool({
      Token: "KSM",
    });

    const record = new VtokenMintingRatio(blockNumber.toString());
    const swapVKSMKSMRecord = await VtokenSwapRatio.get("vKSM_KSM");

    record.block_height = blockNumber;
    record.block_timestamp = block.timestamp;
    record.vksm_balance = vKSMtotalIssuance
      ? (vKSMtotalIssuance as Balance).toBigInt()
      : BigInt(0);
    record.ksm_balance = KSMTokenPool
      ? (KSMTokenPool as Balance).toBigInt()
      : BigInt(0);
    record.ratio =
      KSMTokenPool?.toString() === "0" || vKSMtotalIssuance?.toString() === "0"
        ? "0"
        : new BigNumber(vKSMtotalIssuance?.toString())
            .div(KSMTokenPool?.toString())
            .toString();
    record.vksm_ksm_ratio = swapVKSMKSMRecord?.ratio || "0";
    record.kusd_ksm_ratio = "0";

    await record.save();

    const vMOVRtotalIssuance = await api.query.tokens?.totalIssuance({
      vToken: "MOVR",
    });
    const MOVRTokenPool = await api.query.vtokenMinting?.tokenPool({
      Token: "MOVR",
    });

    const movrRecord = new VtokenMintingMovrRatio(blockNumber.toString());
    const swapVMOVRMOVRRecord = await VtokenSwapRatio.get("vMOVR_MOVR");

    movrRecord.block_height = blockNumber;
    movrRecord.block_timestamp = block.timestamp;
    movrRecord.vmovr_balance = vMOVRtotalIssuance
      ? (vMOVRtotalIssuance as Balance).toBigInt()
      : BigInt(0);
    movrRecord.movr_balance = MOVRTokenPool
      ? (MOVRTokenPool as Balance).toBigInt()
      : BigInt(0);
    movrRecord.ratio =
      MOVRTokenPool?.toString() === "0" ||
      vMOVRtotalIssuance?.toString() === "0"
        ? "0"
        : new BigNumber(vMOVRtotalIssuance?.toString())
            .div(MOVRTokenPool?.toString())
            .toString();
    movrRecord.vmovr_movr_ratio = swapVMOVRMOVRRecord?.ratio || "0";
    movrRecord.kusd_movr_ratio = "0";

    await movrRecord.save();

    const vBNCtotalIssuance = await api.query.tokens?.totalIssuance({
      vToken: "BNC",
    });
    const BNCTokenPool = await api.query.vtokenMinting?.tokenPool({
      Native: "BNC",
    });

    const bncRecord = new VtokenMintingBncRatio(blockNumber.toString());
    const swapBncRecord = await VtokenSwapRatio.get("vBNC_BNC");

    bncRecord.block_height = blockNumber;
    bncRecord.block_timestamp = block.timestamp;
    bncRecord.vbnc_balance = vBNCtotalIssuance
      ? (vBNCtotalIssuance as Balance).toBigInt()
      : BigInt(0);
    bncRecord.bnc_balance = BNCTokenPool
      ? (BNCTokenPool as Balance).toBigInt()
      : BigInt(0);
    bncRecord.ratio =
      BNCTokenPool?.toString() === "0" || vBNCtotalIssuance?.toString() === "0"
        ? "0"
        : new BigNumber(vBNCtotalIssuance?.toString())
            .div(BNCTokenPool?.toString())
            .toString();
    bncRecord.vbnc_bnc_ratio = swapBncRecord?.ratio || "0";

    await bncRecord.save();

    const vPHAtotalIssuance = await api.query.tokens?.totalIssuance({
      vToken: "PHA",
    });
    const PHATokenPool = await api.query.vtokenMinting?.tokenPool({
      Token: "PHA",
    });

    const phaRecord = new VtokenMintingPhaRatio(blockNumber.toString());
    const swapVPHAPHARecord = await VtokenSwapRatio.get("vPHA_PHA");

    phaRecord.block_height = blockNumber;
    phaRecord.block_timestamp = block.timestamp;
    phaRecord.vpha_balance = vPHAtotalIssuance
        ? (vPHAtotalIssuance as Balance).toBigInt()
        : BigInt(0);
    phaRecord.pha_balance = PHATokenPool
        ? (PHATokenPool as Balance).toBigInt()
        : BigInt(0);
    phaRecord.ratio =
        PHATokenPool?.toString() === "0" ||
        vPHAtotalIssuance?.toString() === "0"
            ? "0"
            : new BigNumber(vPHAtotalIssuance?.toString())
                .div(PHATokenPool?.toString())
                .toString();
    phaRecord.vpha_pha_ratio = swapVPHAPHARecord?.ratio || "0";
    phaRecord.kusd_movr_ratio = "0";

    await phaRecord.save();
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
      data: [account, token, balance_ksm, balance_vksm],
    },
  } = event;

  const record = new VtokenMintingMinted(
    blockNumber.toString() + "-" + event.idx.toString()
  );

  record.block_height = blockNumber;
  record.block_timestamp = event.block.timestamp;
  record.token = token.toString();
  record.account = account.toString();
  record.balance_ksm = (balance_ksm as Balance).toBigInt();
  record.balance_vksm = (balance_vksm as Balance).toBigInt();

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
      data: [account, token, balanceKSM, balancevKSM],
    },
  } = event;

  const record = new VtokenMintingRebondedByUnlockId(
    blockNumber.toString() + "-" + event.idx.toString()
  );

  record.block_height = blockNumber;
  record.block_timestamp = event.block.timestamp;
  record.token = token.toString();
  record.account = account.toString();
  record.balance_ksm = (balanceKSM as Balance).toBigInt();
  record.balance_vksm = (balancevKSM as Balance).toBigInt();
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
      data: [account, token, balanceKSM, balancevKSM],
    },
  } = event;

  const record = new VtokenMintingRedeemed(
    blockNumber.toString() + "-" + event.idx.toString()
  );

  record.block_height = blockNumber;
  record.block_timestamp = event.block.timestamp;
  record.token = token.toString();
  record.account = account.toString();
  record.balance_ksm = (balanceKSM as Balance).toBigInt();
  record.balance_vksm = (balancevKSM as Balance).toBigInt();

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

  const vKSMtotalIssuance = await api.query.tokens?.totalIssuance({
    vToken: "KSM",
  });
  const KSMTokenPool = await api.query.vtokenMinting?.tokenPool({
    Token: "KSM",
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
  record.vksm_balance = vKSMtotalIssuance
    ? (vKSMtotalIssuance as Balance).toBigInt()
    : BigInt(0);
  record.ksm_balance = KSMTokenPool
    ? (KSMTokenPool as Balance).toBigInt()
    : BigInt(0);
  record.ratio =
    KSMTokenPool?.toString() === "0" || vKSMtotalIssuance?.toString() === "0"
      ? "0"
      : new BigNumber(vKSMtotalIssuance?.toString())
          .div(KSMTokenPool?.toString())
          .toString();

  await record.save();
}
