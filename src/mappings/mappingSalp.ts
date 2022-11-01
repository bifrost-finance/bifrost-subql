import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { BlockNumber, Balance, MessageId } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import type { ParaId } from "@polkadot/types/interfaces/parachains";
import type {
  AccountIdOf,
  BalanceOf,
} from "@polkadot/types/interfaces/runtime";
import { SalpInfo } from "../types/models/SalpInfo";
import { SalpContributed } from "../types/models/SalpContributed";
import { SalpContribution } from "../types/models/SalpContribution";
import { SalpRefunded } from "../types/models/SalpRefunded";

const isFundEvent = (eventType: string): boolean => {
  if (
    eventType === "Created" ||
    eventType === "Dissolved" ||
    eventType === "Withdrew" ||
    eventType === "Edited" ||
    eventType === "Success" ||
    eventType === "Failed" ||
    eventType === "Retired" ||
    eventType === "End"
  ) {
    return true;
  }
  return false;
};

const isContributionEvent = (eventType: string): boolean => {
  if (
    eventType === "Contributing" ||
    eventType === "Contributed" ||
    eventType === "ContributeFailed" ||
    eventType === "Issued" ||
    eventType === "Redeemed" ||
    eventType === "Refunded"
  ) {
    return true;
  }
  return false;
};

export async function salp(block: SubstrateBlock): Promise<void> {
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  ).toBigInt();
  let paraId;
  const salpEvents = block.events.filter(
    (e) => e.event.section === "salp" || e.event.section === "salpLite"
  ) as unknown as SubstrateEvent[];
  for (let salpEvent of salpEvents) {
    const {
      event: { data, section, method },
    } = salpEvent;
    if (isFundEvent(method)) {
      paraId = (data[0] as ParaId).toString();
      const record = new SalpInfo(
        blockNumber.toString() + "-" + salpEvent.idx.toString()
      );
      record.blockHeight = blockNumber;
      record.method = method.toString();
      record.data = data.toString();
      record.para_id = paraId;
      await record.save();
    }
  }
}

export async function salpContribution(block: SubstrateBlock): Promise<void> {
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  ).toNumber();
  const salpEvents = block.events.filter(
    (e) => e.event.section === "salp" || e.event.section === "salpLite"
  ) as unknown as SubstrateEvent[];
  for (let salpEvent of salpEvents) {
    let accountIdOf, paraId, balanceOf, message_id;
    const {
      event: { data, section, method },
    } = salpEvent;
    if (isContributionEvent(method)) {
      accountIdOf = data[0].toString();
      paraId = (data[1] as ParaId).toNumber();
      if (
        method === "Contributing" ||
        method === "Contributed" ||
        method === "ContributeFailed" ||
        method === "Issued"
      ) {
        balanceOf = (data[2] as BalanceOf).toBigInt();
        message_id = (data[3] as MessageId).toString();
      } else if (method === "Refunded") {
        balanceOf = (data[4] as BalanceOf).toBigInt();
      } else if (method === "Redeemed") {
        balanceOf = (data[4] as BalanceOf).toBigInt();
      }
      const record = new SalpContribution(
        blockNumber.toString() + "-" + salpEvent.idx.toString()
      );
      record.block_height = blockNumber;
      record.block_timestamp = block.timestamp;
      record.method = method.toString();
      record.account = accountIdOf;
      record.para_id = paraId;
      record.balance = balanceOf;
      record.message_id = message_id;
      await record.save();
    }
  }
}

const _handleSalpContributed = async (event: SubstrateEvent): Promise<void> => {
  const blockNumber = event.block.block.header.number.toNumber();

  const {
    event: {
      data: [account, para_id, balance, message_id],
    },
  } = event;
  const record = new SalpContributed(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic.idx;
  record.block_timestamp = event.block.timestamp;
  record.account = account.toString();
  record.para_id = (para_id as ParaId).toNumber();
  record.balance = (balance as Balance).toBigInt();
  record.message_id = (message_id as MessageId).toString();
  await record.save();
};

export const handleSalpContributed = _handleSalpContributed;

export const handleSalpLiteContributed = _handleSalpContributed;

const _handleSalpRefunded = async (event: SubstrateEvent): Promise<void> => {
  const blockNumber = event.block.block.header.number.toNumber();
  const {
    event: {
      data: [account, para_id, balance],
    },
  } = event;
  const record = new SalpRefunded(
    blockNumber.toString() + "-" + event.idx.toString()
  );
  record.block_height = blockNumber;
  record.event_id = event.idx;
  record.extrinsic_id = event.extrinsic.idx;
  record.block_timestamp = event.block.timestamp;
  record.account = account.toString();
  record.para_id = (para_id as ParaId).toNumber();
  record.balance = (balance as Balance).toBigInt();
  await record.save();
};

export const handleSalpRefunded = _handleSalpRefunded;
