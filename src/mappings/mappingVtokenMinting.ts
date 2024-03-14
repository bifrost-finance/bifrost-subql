import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { Balance, BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import BigNumber from "bignumber.js";
import axiosOriginal from 'axios';
import adapter from "axios/lib/adapters/http";

const axios = axiosOriginal.create({ adapter });

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
  VtokenMintingAstrRatio,
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

    const vASTRtotalIssuance = await api.query.tokens?.totalIssuance({
      vToken2: "3",
    });
    const ASTRTokenPool = await api.query.vtokenMinting?.tokenPool({
      Token2: "3",
    });

    const astrRecord = new VtokenMintingAstrRatio(blockNumber.toString());
    const swapVASTRASTRRecord = await VtokenSwapRatio.get("vASTR_ASTR");

    astrRecord.block_height = blockNumber;
    astrRecord.block_timestamp = block.timestamp;
    astrRecord.vastr_balance = vASTRtotalIssuance
      ? (vASTRtotalIssuance as Balance).toBigInt()
      : BigInt(0);
    astrRecord.astr_balance = ASTRTokenPool
      ? (ASTRTokenPool as Balance).toBigInt()
      : BigInt(0);
    astrRecord.ratio =
      ASTRTokenPool?.toString() === "0" || vASTRtotalIssuance?.toString() === "0"
        ? "0"
        : new BigNumber(vASTRtotalIssuance?.toString())
          .div(ASTRTokenPool?.toString())
          .toString();
    astrRecord.vastr_astr_ratio = swapVASTRASTRRecord?.ratio || "0";

    await astrRecord.save();
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


  // Prepare the slack message
  const message = {
    text: `Bifrost Polkadot VtokenMinting Minted Event`,
    attachments: [
      {
        color: '#36a64f',
        title: `Explorer the ${blockNumber} subscan`,
        title_link: `https://bifrost.subscan.io/block/${blockNumber}`,
        fields: [
          {
            title: 'Minted Block Height:',
            value: ` *${blockNumber.toString()}*`,
            short: true
          },
          {
            title: 'Token ID:',
            value: `*${token}*`,
            short: true
          },
          {
            title: 'Account:',
            value: `*${account}*`,
            short: false
          },
          {
            title: 'Token Amount:',
            value: `*${balance_dot}*`,
            short: true
          },
          {
            title: 'vToken Amount:',
            value: `*${balance_vdot}*`,
            short: true
          }
        ]
      }
    ]
  };
  // const webhookUrl = "https://hooks.slack.com/services/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"

  const webhookUrl = "https://hooks.slack.com/services/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"
  // Send the message to Slack
  await axios.post(webhookUrl, message);
  // const response = await fetch(webhookUrl, {
  //   method: 'POST',
  //   body: JSON.stringify(message),
  //   headers: {'Content-Type': 'application/json'}
  // });

  // if (!response.ok) {
  //   throw new Error(`Failed to post message to Slack, status: ${response.status}`);
  // }

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

  // Prepare the slack message
  const message = {
    text: `Bifrost Polkadot VtokenMinting Redeemed Event`,
    attachments: [
      {
        color: '#36a64f',
        title: `Explorer the ${blockNumber} subscan`,
        title_link: `https://bifrost.subscan.io/block/${blockNumber}`,
        fields: [
          {
            title: 'Redeemed Block Height:',
            value: ` *${blockNumber.toString()}*`,
            short: true
          },
          {
            title: 'Token ID:',
            value: `*${token}*`,
            short: true
          },
          {
            title: 'Account:',
            value: `*${account}*`,
            short: false
          },
          {
            title: 'Token Amount:',
            value: `*${balanceDOT}*`,
            short: true
          },
          {
            title: 'vToken Amount:',
            value: `*${balancevDOT}*`,
            short: true
          }
        ]
      }
    ]
  };
  // const webhookUrl = "https://hooks.slack.com/services/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"

  const webhookUrl = "https://hooks.slack.com/services/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"
  // Send the message to Slack
  await axios.post(webhookUrl, message);

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
