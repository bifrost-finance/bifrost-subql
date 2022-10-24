import { SubstrateExtrinsic, SubstrateEvent } from "@subql/types";
import { Balance, BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import BigNumber from "bignumber.js";

import { VtokenTransfer, VtokenGlmrTransfer } from "../types";

export async function handleCurrenciesTransferred(
  extrinsic: SubstrateExtrinsic
): Promise<void> {
  const { block, events } = extrinsic;
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  ).toBigInt();

  const transferEvent = events.find(
    (e) =>
      (e.event.section === "currencies" && e.event.method === "Transferred") ||
      (e.event.section === "tokens" && e.event.method === "Transfer")
  ) as SubstrateEvent;

  if (transferEvent) {
    const {
      event: {
        data: [currency, from, to, balance],
      },
    } = transferEvent;

    if (currency.toString() === '{"vToken2":"0"}') {
      const vDOTtotalIssuance = await api.query.tokens?.totalIssuance({
        vToken2: "0",
      });
      const DOTTokenPool = await api.query.vtokenMinting?.tokenPool({
        Token2: "0",
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
      record.vdot_balance = vDOTtotalIssuance
        ? (vDOTtotalIssuance as Balance).toBigInt()
        : BigInt(0);
      record.dot_balance = DOTTokenPool
        ? (DOTTokenPool as Balance).toBigInt()
        : BigInt(0);
      record.ratio =
        DOTTokenPool?.toString() === "0" ||
        vDOTtotalIssuance?.toString() === "0"
          ? "0"
          : new BigNumber(vDOTtotalIssuance?.toString())
              .div(DOTTokenPool?.toString())
              .toString();
      await record.save();
    }

    if (currency.toString() === '{"vToken":"1"}') {
      const vGLMRTotalIssuance = await api.query.tokens?.totalIssuance({
        vToken2: "1",
      });
      const GLMRTokenPool = await api.query.vtokenMinting?.tokenPool({
        Token2: "1",
      });

      const record = new VtokenGlmrTransfer(
        blockNumber.toString() + "-" + transferEvent.idx.toString()
      );
      record.block_height = blockNumber;
      record.block_timestamp = transferEvent.block.timestamp;
      record.from_account = from.toString();
      record.to_account = to.toString();
      record.currency = currency.toString();
      record.balance = (balance as Balance).toBigInt();
      record.vglmr_balance = vGLMRTotalIssuance
        ? (vGLMRTotalIssuance as Balance).toBigInt()
        : BigInt(0);
      record.glmr_balance = GLMRTokenPool
        ? (GLMRTokenPool as Balance).toBigInt()
        : BigInt(0);
      record.ratio =
        GLMRTokenPool?.toString() === "0" ||
        vGLMRTotalIssuance?.toString() === "0"
          ? "0"
          : new BigNumber(vGLMRTotalIssuance?.toString())
              .div(GLMRTokenPool?.toString())
              .toString();
      await record.save();
    }
  }
}
