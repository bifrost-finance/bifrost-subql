import {
  SubstrateBlock,
  SubstrateEvent,
  SubstrateExtrinsic,
} from "@subql/types";
import { Balance, BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import BigNumber from "bignumber.js";

import {
  VtokenSwapRatio,
  VtokenMintingInfo,
  VtokenMintingMinted,
  VtokenMintingRatio,
  VtokenMintingRedeemedEndowed,
  VtokenMintingRedeemed,
  VtokenMintingRebondedByUnlockId,
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
    const vKSMtotalIssuance = await api.query.tokens.totalIssuance({
      vToken: "KSM",
    });
    const KSMTokenPool = await api.query.vtokenMinting.tokenPool({
      Token: "KSM",
    });

    const record = new VtokenMintingRatio(blockNumber.toString());
    const swapVKSMKSMRecord = await VtokenSwapRatio.get("vKSM_KSM");
    const swapVUSDKSMRecord = await VtokenSwapRatio.get("kUSD_KSM");

    record.block_height = blockNumber;
    record.block_timestamp = block.timestamp;
    record.vksm_balance = (vKSMtotalIssuance as Balance).toBigInt();
    record.ksm_balance = (KSMTokenPool as Balance).toBigInt();
    record.ratio =
      KSMTokenPool.toString() === "0" || vKSMtotalIssuance.toString() === "0"
        ? "0"
        : new BigNumber(vKSMtotalIssuance.toString())
            .div(KSMTokenPool.toString())
            .toString();
    record.vksm_ksm_ratio = swapVKSMKSMRecord?.ratio || "0";
    record.kusd_ksm_ratio = swapVUSDKSMRecord?.ratio || "0";

    await record.save();
  }
  return;
}

export async function handleVtokenMintingMinted(
  extrinsic: SubstrateExtrinsic
): Promise<void> {
  const { block, events } = extrinsic;
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  ).toBigInt();
  const vtokenMintingMintedEvent = events.find(
    (e) => e.event.section === "vtokenMinting" && e.event.method === "Minted"
  ) as SubstrateEvent;
  const vtokenMintingMintedDepositedEvent = events.find(
    (e) => e.event.section === "currencies" && e.event.method === "Deposited"
  ) as SubstrateEvent;

  if (vtokenMintingMintedEvent && vtokenMintingMintedDepositedEvent) {
    const {
      event: {
        data: [token, balance],
      },
    } = vtokenMintingMintedEvent;
    const {
      event: {
        data: [depositedCurrency, account, getVKSMBalance],
      },
    } = vtokenMintingMintedDepositedEvent;

    if (depositedCurrency.toString() === `{"vToken":"KSM"}`) {
      const record = new VtokenMintingMinted(
        `${blockNumber}-${extrinsic.idx.toString()}`
      );

      record.block_height = blockNumber;
      record.block_timestamp = block.timestamp;
      record.mint_token = token.toString();
      record.account = account.toString();
      record.balance = (balance as Balance).toBigInt();
      record.vksm_balance = (getVKSMBalance as Balance).toBigInt();

      await record.save();
    }
  }
}

export async function handleVtokenMintingRebondedByUnlockId(
  extrinsic: SubstrateExtrinsic
): Promise<void> {
  const { block, events } = extrinsic;
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  ).toBigInt();

  const vtokenMintingEndowedEvent = events.find(
    (e) => e.event.section === "tokens" && e.event.method === "Endowed"
  ) as SubstrateEvent;
  const vtokenMintingRebondedByUnlockIdEvent = events.find(
    (e) =>
      e.event.section === "vtokenMinting" &&
      e.event.method === "RebondedByUnlockId"
  ) as SubstrateEvent;

  if (vtokenMintingEndowedEvent && vtokenMintingRebondedByUnlockIdEvent) {
    const {
      event: {
        data: [token, balanceKSM, balanceVKSM],
      },
    } = vtokenMintingRebondedByUnlockIdEvent;
    const {
      event: {
        data: [endowedToken, account, endowedVKSM],
      },
    } = vtokenMintingEndowedEvent;
    const record = new VtokenMintingRebondedByUnlockId(
      blockNumber.toString() +
        "-" +
        vtokenMintingRebondedByUnlockIdEvent.idx.toString()
    );
    record.block_height = blockNumber;
    record.event_id = vtokenMintingRebondedByUnlockIdEvent.idx;
    record.block_timestamp =
      vtokenMintingRebondedByUnlockIdEvent.block.timestamp;
    record.token = token.toString();
    record.endowed_token = endowedToken.toString();
    record.account = account.toString();
    record.balance_ksm = (balanceKSM as Balance).toBigInt();
    record.balance_vksm = (balanceVKSM as Balance).toBigInt();
    record.balance_endowed_vksm = (endowedVKSM as Balance).toBigInt();
    await record.save();
  }
}

export async function handleVtokenMintingRedeemed(
  extrinsic: SubstrateExtrinsic
): Promise<void> {
  const { block, events } = extrinsic;
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  ).toBigInt();

  const vtokenMintingWithdrawnEvent = events.find(
    (e) => e.event.section === "currencies" && e.event.method === "Withdrawn"
  ) as SubstrateEvent;
  const vtokenMintingRedeemedEvent = events.find(
    (e) => e.event.section === "vtokenMinting" && e.event.method === "Redeemed"
  ) as SubstrateEvent;

  if (vtokenMintingRedeemedEvent && vtokenMintingWithdrawnEvent) {
    const {
      event: {
        data: [token, balanceKSM, balanceVKSM],
      },
    } = vtokenMintingRedeemedEvent;
    const {
      event: {
        data: [withdrawnToken, account, withdrawnBalance],
      },
    } = vtokenMintingWithdrawnEvent;

    const record = new VtokenMintingRedeemed(
      blockNumber.toString() + "-" + vtokenMintingRedeemedEvent.idx.toString()
    );
    record.block_height = blockNumber;
    record.event_id = vtokenMintingRedeemedEvent.idx;
    record.block_timestamp = vtokenMintingRedeemedEvent.block.timestamp;
    record.token = token.toString();
    record.withdrawn_token = withdrawnToken.toString();
    record.account = account.toString();
    record.balance_ksm = (balanceKSM as Balance).toBigInt();
    record.balance_vksm = (balanceVKSM as Balance).toBigInt();
    record.withdrawn_vksm_balance = (withdrawnBalance as Balance).toBigInt();
    await record.save();
  }
}

export async function handleVtokenMintingRedeemedEndowed(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = (
    event.block.block.header.number as Compact<BlockNumber>
  ).toBigInt();

  const {
    event: {
      data: [token, account, balanceKSM],
    },
  } = event;
  if (token.toString() === `{"token":"KSM"}`) {
    const record = new VtokenMintingRedeemedEndowed(
      blockNumber.toString() + "-" + event.idx.toString()
    );
    record.block_height = blockNumber;
    record.event_id = event.idx;
    record.block_timestamp = event.block.timestamp;
    record.token = token.toString();
    record.token = account.toString();
    record.balance_ksm = (balanceKSM as Balance).toBigInt();

    await record.save();
  }
}
