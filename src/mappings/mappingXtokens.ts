import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { Balance } from "@polkadot/types/interfaces";
import { CurrencyId } from "@bifrost-finance/types/interfaces";
import {
  XtokensTransferred,
  TotalTransfer,
  TokensTotalIssuance,
} from "../types";

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
  record.balance = (balance as Balance)?.toBigInt();
  record.multilocation = multilocation.toString();
  await record.save();
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
  record.balance = (balance as Balance)?.toBigInt();
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
  record.balance = (balance as Balance)?.toBigInt();
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
  record.balance = (balance as Balance)?.toBigInt();
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
  record.balance = (balance as Balance)?.toBigInt();
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
  record.balance = (balance as Balance)?.toBigInt();
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
  record.balance = (balance as Balance)?.toBigInt();
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
  record.balance = (balance as Balance)?.toBigInt();
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
  record.balance = (balance as Balance)?.toBigInt();
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
  record.balance = (balance as Balance)?.toBigInt();
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
  record.balance = (free as Balance)?.toBigInt();
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
  record.balance = (balance as Balance)?.toBigInt();
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
  record.balance = (balance as Balance)?.toBigInt();
  await record.save();
}

export async function tokens(block: SubstrateBlock): Promise<void> {
  const blockNumber = block.block.header.number.toNumber();
  if (blockNumber % 100 !== 0) {
    return;
  }

  const vsDOT = (
    (await api.query.tokens?.totalIssuance({ VSToken2: 0 }).catch((e) => {
      console.log(e);
    })) as Balance
  )?.toBigInt();
  const vDOT = (
    (await api.query.tokens?.totalIssuance({ VToken2: 0 }).catch((e) => {
      console.log(e);
    })) as Balance
  )?.toBigInt();
  const vGLMR = (
    (await api.query.tokens?.totalIssuance({ VToken2: 1 }).catch((e) => {
      console.log(e);
    })) as Balance
  )?.toBigInt();
  const vFIL = (
      (await api.query.tokens?.totalIssuance({ VToken2: 4 }).catch((e) => {
        console.log(e);
      })) as Balance
  )?.toBigInt();
  const vASTR = (
      (await api.query.tokens?.totalIssuance({ VToken2: 3 }).catch((e) => {
        console.log(e);
      })) as Balance
  )?.toBigInt();

  const record = new TokensTotalIssuance(block.block.header.hash.toString());
  record.block_height = blockNumber;
  record.block_timestamp = block.timestamp;
  record.vdot = vDOT;
  record.vsdot = vsDOT;
  record.vglmr = vGLMR;
  record.vfil = vFIL;
  record.vastr = vASTR;
  await record.save();
}
