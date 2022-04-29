import { SubstrateExtrinsic, SubstrateEvent } from "@subql/types";
import { Balance, BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import BigNumber from "bignumber.js";

import { VtokenTransfer } from "../types";

export async function handleCurrenciesTransferred(
  extrinsic: SubstrateExtrinsic
): Promise<void> {
  const { block, events } = extrinsic;
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  ).toBigInt();

  const transferEvent = events.find(
    (e) => e.event.section === "currencies" && e.event.method === "Transferred"
  ) as SubstrateEvent;

  if (transferEvent) {
    const {
      event: {
        data: [currency, from, to, balance],
      },
    } = transferEvent;

    if (currency.toString() === '{"vToken":"KSM"}') {
      const vKSMtotalIssuance = await api.query.tokens?.totalIssuance({
        vToken: "KSM",
      });
      const KSMTokenPool = await api.query.vtokenMinting?.tokenPool({
        Token: "KSM",
      });

      const record = new VtokenTransfer(
        blockNumber.toString() + "-" + transferEvent.idx.toString()
      );
      record.block_height = blockNumber;
      record.block_timestamp = transferEvent.block.timestamp;
      record.from_account = from.toString();
      record.to_account = to.toString();
      record.currency = currency.toString();
      record.balance = (balance as Balance).toBigInt();
      record.vksm_balance = vKSMtotalIssuance
        ? (vKSMtotalIssuance as Balance).toBigInt()
        : BigInt(0);
      record.ksm_balance = KSMTokenPool
        ? (KSMTokenPool as Balance).toBigInt()
        : BigInt(0);
      record.ratio =
        KSMTokenPool?.toString() === "0" ||
        vKSMtotalIssuance?.toString() === "0"
          ? "0"
          : new BigNumber(vKSMtotalIssuance?.toString())
              .div(KSMTokenPool?.toString())
              .toString();
      await record.save();
    }
  }
}
