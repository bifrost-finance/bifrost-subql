import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { BlockNumber, Balance, MessageId } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import type { ParaId } from "@polkadot/types/interfaces/parachains";
import type {
  AccountIdOf,
  BalanceOf,
} from "@polkadot/types/interfaces/runtime";
import { CurrencyId, TokenSymbol } from "@bifrost-finance/types/interfaces";
import {
  XtokensTransferred,
  TotalTransfer,
  TokensTotalIssuance,
} from "../types/models";

export async function handleXtokensTransferredMultiAssets(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const {
    event: {
      section,
      method,
      data: [account, multiassets, multiasset, multilocation],
    },
  } = event;
  let assets = JSON.parse(JSON.stringify(multiassets));
  let list = [];
  for (let i = 0; i < assets.length; i++) {
    const record = new XtokensTransferred(
      blockNumber.toString() + "-" + event.idx.toString() + "-" + i
    );
    record.block_height = blockNumber;
    record.event_id = event.idx;
    record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
    record.block_timestamp = event.block.timestamp;
    record.account = account.toString();
    record.multilocation = multilocation.toString();
    record.assets = multiassets.toString();
    record.fungible = BigInt(assets[i].fun.fungible);
    record.assets_id = JSON.stringify(assets[i].id);
    list.push(record.save());
  }
  await Promise.all(list);
}

export async function handleXtokensTransferred(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const {
    event: {
      section,
      method,
      data: [account, currency, balance, multilocation],
    },
  } = event;
  const record = new XtokensTransferred(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.account = account.toString();
  record.currency = (currency as CurrencyId).toString();
  record.balance = (balance as Balance).toBigInt();
  record.multilocation = multilocation.toString();
  await record.save();

  // const record2 = new TotalTransfer(blockNumber.toString() + '-' + event.idx.toString());
  // record2.block_height = blockNumber;
  // record2.event_id = event.idx;
  // record2.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  // record2.block_timestamp = event.block.timestamp;
  // record2.section = section.toString();
  // record2.method = method.toString();
  // record2.to = account.toString();
  // record2.currency = (currency as CurrencyId).toString();
  // record2.balance = (balance as Balance).toBigInt();
  // await record.save();
}

export async function handleCurrenciesDeposited(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const {
    event: {
      section,
      method,
      data: [currency, account, balance],
    },
  } = event;
  const record = new TotalTransfer(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.section = section.toString();
  record.method = method.toString();
  record.to = account.toString();
  record.currency = (currency as CurrencyId).toString();
  record.balance = (balance as Balance).toBigInt();
  await record.save();
}

export async function handleCurrenciesWithdrawn(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const {
    event: {
      section,
      method,
      data: [currency, account, balance],
    },
  } = event;
  const record = new TotalTransfer(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.section = section.toString();
  record.method = method.toString();
  record.from = account.toString();
  record.currency = (currency as CurrencyId).toString();
  record.balance = (balance as Balance).toBigInt();
  await record.save();
}

export async function handleCurrenciesTransferred(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const {
    event: {
      section,
      method,
      data: [currency, from, to, balance],
    },
  } = event;
  const record = new TotalTransfer(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.section = section.toString();
  record.method = method.toString();
  record.from = from.toString();
  record.to = to.toString();
  record.currency = (currency as CurrencyId).toString();
  record.balance = (balance as Balance).toBigInt();
  await record.save();
}

export async function handleCurrenciesBalanceUpdated(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const {
    event: {
      section,
      method,
      data: [currency, account, balance],
    },
  } = event;
  const record = new TotalTransfer(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.section = section.toString();
  record.method = method.toString();
  record.from = account.toString();
  record.currency = (currency as CurrencyId).toString();
  record.balance = (balance as Balance).toBigInt();
  await record.save();
}

export async function handleTokensTransfer(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const {
    event: {
      section,
      method,
      data: [currency, from, to, balance],
    },
  } = event;
  const record = new TotalTransfer(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.section = section.toString();
  record.method = method.toString();
  record.from = from.toString();
  record.to = to.toString();
  record.currency = (currency as CurrencyId).toString();
  record.balance = (balance as Balance).toBigInt();
  await record.save();
}

export async function handleTokensEndowed(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const {
    event: {
      section,
      method,
      data: [currency, to, balance],
    },
  } = event;
  const record = new TotalTransfer(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.section = section.toString();
  record.method = method.toString();
  // record.from = from.toString();
  record.to = to.toString();
  record.currency = (currency as CurrencyId).toString();
  record.balance = (balance as Balance).toBigInt();
  await record.save();
}

export async function handleTokensDustLost(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const {
    event: {
      section,
      method,
      data: [currency, from, balance],
    },
  } = event;
  const record = new TotalTransfer(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.section = section.toString();
  record.method = method.toString();
  record.from = from.toString();
  // record.to = to.toString();
  record.currency = (currency as CurrencyId).toString();
  record.balance = (balance as Balance).toBigInt();
  await record.save();
}

export async function handleTokensReserved(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const {
    event: {
      section,
      method,
      data: [currency, from, balance],
    },
  } = event;
  const record = new TotalTransfer(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.section = section.toString();
  record.method = method.toString();
  record.from = from.toString();
  // record.to = to.toString();
  record.currency = (currency as CurrencyId).toString();
  record.balance = (balance as Balance).toBigInt();
  await record.save();
}

export async function handleTokensUnreserved(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const {
    event: {
      section,
      method,
      data: [currency, to, balance],
    },
  } = event;
  const record = new TotalTransfer(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.section = section.toString();
  record.method = method.toString();
  // record.from = from.toString();
  record.to = to.toString();
  record.currency = (currency as CurrencyId).toString();
  record.balance = (balance as Balance).toBigInt();
  await record.save();
}

export async function handleTokensBalanceSet(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const {
    event: {
      section,
      method,
      data: [currency, to, free, reserved],
    },
  } = event;
  const record = new TotalTransfer(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.section = section.toString();
  record.method = method.toString();
  // record.from = from.toString();
  record.to = to.toString();
  record.currency = (currency as CurrencyId).toString();
  record.balance = (free as Balance).toBigInt();
  await record.save();
}

export async function handleTokenIssuerTransferred(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const {
    event: {
      section,
      method,
      data: [from, to, currency, balance],
    },
  } = event;
  const record = new TotalTransfer(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.section = section.toString();
  record.method = method.toString();
  record.from = from.toString();
  record.to = to.toString();
  record.currency = (currency as CurrencyId).toString();
  record.balance = (balance as Balance).toBigInt();
  await record.save();
}

export async function handleTokenIssuerIssued(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const {
    event: {
      section,
      method,
      data: [to, currency, balance],
    },
  } = event;
  const record = new TotalTransfer(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic ? event.extrinsic.idx : null;
  record.block_timestamp = event.block.timestamp;
  record.section = section.toString();
  record.method = method.toString();
  // record.from = from.toString();
  record.to = to.toString();
  record.currency = (currency as CurrencyId).toString();
  record.balance = (balance as Balance).toBigInt();
  await record.save();
}

export async function tokens(block: SubstrateBlock): Promise<void> {
  const blockNumber = block.block.header.number.toNumber();
  if (blockNumber % 100 !== 0) {
    return;
  }

  const vsKSM = (
    (await api.query.tokens.totalIssuance({
      vsToken: "KSM",
    })) as unknown as Balance
  ).toBigInt();
  const vsDOT = (
    (await api.query.tokens.totalIssuance({
      vsToken: "DOT",
    })) as unknown as Balance
  ).toBigInt();
  const vksm = (
    (await api.query.tokens?.totalIssuance({
      vToken: "KSM",
    })) as unknown as Balance
  ).toBigInt();
  const vmovr = (
    (await api.query.tokens?.totalIssuance({
      vToken: "MOVR",
    })) as unknown as Balance
  ).toBigInt();
  const vbnc = (
    (await api.query.tokens?.totalIssuance({
      vToken: "BNC",
    })) as unknown as Balance
  ).toBigInt();

  const record = new TokensTotalIssuance(block.block.header.hash.toString());
  record.block_height = blockNumber;
  record.block_timestamp = block.timestamp;
  record.vsksm = vsKSM;
  record.vsdot = vsDOT;
  record.vksm = vksm;
  record.vmovr = vmovr;
  record.vbnc = vbnc;
  await record.save();
}
