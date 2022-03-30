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
