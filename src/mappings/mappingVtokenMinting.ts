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
} from "../types";

export async function vtokenMinting(block: SubstrateBlock): Promise<void> {
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  ).toBigInt();
  const vtokenMintingEvents = block.events.filter(
    (e) => e.event.section === "vtokenMinting"
  ) as SubstrateEvent[];

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
    const swapVUSDKSMRecord = await VtokenSwapRatio.get("kUSD_KSM");

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
    record.kusd_ksm_ratio = swapVUSDKSMRecord?.ratio || "0";

    await record.save();
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

  const record = new VtokenRedeemedSuccess(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.block_timestamp = event.block.timestamp;
  record.redeem_id = id.toString();
  record.token = token.toString();
  record.account = account.toString();
  record.balance = (balance as Balance).toBigInt();

  await record.save();
}
