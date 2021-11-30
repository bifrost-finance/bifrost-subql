import { SignedBlock } from "@polkadot/types/interfaces";
import { SubstrateExtrinsic, SubstrateEvent } from "@subql/types";
import { StarterEntity } from "../types/models/StarterEntity";
import { Balance, Moment } from "@polkadot/types/interfaces";
import { SubstrateBlock } from "@subql/types";
import { getPrice } from "../common";
import { Tvl } from '../types/models';
import BigNumber from "bignumber.js";

let tokens = [
  {
    coin_id: "kusama",
    currency: { "vsToken": "KSM" }
  },
  {
    coin_id: "polkadot",
    currency: { "vsToken": "DOT" }
  }
];

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  const blockNumber = block.block.header.number.toNumber();
  if (block.block.header.number.toNumber() % 100 !== 0) { return }
  logger.info(block.block.header.number.toNumber());
  await Promise.all(tokens.map(async (token) => {
    const token_price = await getPrice(block, token.coin_id);
    let record = new Tvl(blockNumber.toString() + "-" + token.coin_id);
    record.block_height = block.block.header.number.toNumber();
    record.block_timestamp = block.timestamp;
    record.currency = JSON.stringify(token.currency);
    const token_total_issuance = await api.query.tokens.totalIssuance(token.currency)
    record.total_issuance = (token_total_issuance as Balance).toBigInt();
    record.usd = parseFloat(token_price.usd);
    record.cny = parseFloat(token_price.cny);
    const tvlNum = new BigNumber(token_price.cny).multipliedBy(token_total_issuance.toString());
    record.tvl = parseFloat(tvlNum.div(1e+12).toFixed(2).toString());
    await record.save();
  }));

}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
  const { event: { data: [account, balance] } } = event;
  //Retrieve the record by its ID
  const record = await StarterEntity.get(event.extrinsic.block.block.header.hash.toString());
  record.field2 = account.toString();
  //Big integer type Balance of a transfer event
  record.field3 = (balance as Balance).toBigInt();
  await record.save();
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
  const record = await StarterEntity.get(extrinsic.block.block.header.hash.toString());
  //Date type timestamp
  record.field4 = extrinsic.block.timestamp;
  await record.save();
}


