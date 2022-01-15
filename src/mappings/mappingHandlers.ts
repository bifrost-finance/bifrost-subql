import { SignedBlock } from "@polkadot/types/interfaces";
import { SubstrateExtrinsic, SubstrateEvent } from "@subql/types";
import { StarterEntity } from "../types/models/StarterEntity";
import { Balance, Moment } from "@polkadot/types/interfaces";
import { SubstrateBlock } from "@subql/types";
import { getPrice } from "../common";
import { Tvl } from '../types/models';
import BigNumber from "bignumber.js";

const Tokens = [
  {
    id: "vsKSM",
    coin_id: "kusama",
    currency: { "vsToken": "KSM" },
    decimal: 12
  },
  {
    id: "vsDOT",
    coin_id: "polkadot",
    currency: { "vsToken": "DOT" },
    decimal: 10
  }
];

const DexTokens = [
  {
    id: "vsKSM-dex",
    coin_id: "kusama",
    currency: { "vsToken": "KSM" },
    decimal: 12,
    dex_address: [["5EYCAe5ViNAoHnU1ZZAMeuwFRzWVSR8nXc92oKzfVm5Mqh7Q", { "vsToken": "KSM" }]]
  },
  {
    id: "KSM-dex",
    coin_id: "kusama",
    currency: { "Token": "KSM" },
    decimal: 12,
    dex_address: [
      ["5EYCAe5ViNAoHnU1ZZAMeuwFRzWVSR8nXc92oKzfVm5Mqh7Q", { "Token": "KSM" }],
      ["5EYCAe5ViNAoHnU1ZZAR51LmTJsa1PC4JmRES1LEWhhomrXX", { "Token": "KSM" }],
      ["5EYCAe5ViNAoHnU1ZZAJu3bwfpqQ7zTeBZ4VWBYvzNsXugiH", { "Token": "KSM" }]
    ]
  },
  {
    id: "ZLK-dex",
    coin_id: "zenlink-network-token",
    currency: { "Token": "ZLK" },
    decimal: 18,
    dex_address: [["5EYCAe5ViNAoHnU1ZZAKfoyy3zaPgXQF31qreBoKBD5ZuYrM", { "Token": "ZLK" }]]
  },
  {
    id: "BNC-dex",
    coin_id: "bifrost-native-coin",
    currency: { "Native": "BNC" },
    decimal: 12,
    dex_address: [
      "5EYCAe5ViNAoHnU1ZZAKfoyy3zaPgXQF31qreBoKBD5ZuYrM",
      "5EYCAe5ViNAoHnU1ZZAR51LmTJsa1PC4JmRES1LEWhhomrXX"
    ]
  },
  {
    id: "kUSD-dex",
    coin_id: "tether",
    currency: { "Stable": "KUSD" },
    decimal: 12,
    dex_address: [["5EYCAe5ViNAoHnU1ZZAJu3bwfpqQ7zTeBZ4VWBYvzNsXugiH", { "Stable": "KUSD" }]]
  }
];

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  const blockNumber = block.block.header.number.toNumber();
  if (block.block.header.number.toNumber() % 100 !== 0) { return }
  await Promise.all(Tokens.map(async (token) => {
    const token_price = await getPrice(block, token.coin_id);
    if (token_price.cny === "0") { return }
    let record = new Tvl(blockNumber.toString() + "-" + token.id);
    record.block_height = block.block.header.number.toNumber();
    record.block_timestamp = block.timestamp;
    record.currency = JSON.stringify(token.currency);
    const token_total_issuance = await api.query.tokens.totalIssuance(token.currency)
    record.total_issuance = (token_total_issuance as Balance).toBigInt();
    record.usd = parseFloat(token_price.usd);
    record.cny = parseFloat(token_price.cny);
    const tvlNum = new BigNumber(token_price.usd).multipliedBy(token_total_issuance.toString());
    // record.tvl = parseFloat(tvlNum.div(1e+12).toFixed(2).toString());
    record.tvl_native = BigInt(tvlNum.toFixed(0));
    record.tvl = parseFloat(tvlNum.div("1e+" + token.decimal).toFixed(2));
    record.isdex = false;
    await record.save();
  }));

  await Promise.all(DexTokens.map(async (token) => {
    const token_price = await getPrice(block, token.coin_id);
    if (token_price.cny === "0") { return }
    let record = new Tvl(blockNumber.toString() + "-" + token.id);
    record.block_height = block.block.header.number.toNumber();
    record.block_timestamp = block.timestamp;
    record.currency = JSON.stringify(token.currency);
    let token_total_issuance = new BigNumber(0);
    // const tokens_accounts_result= await api.query.tokens.accounts.multi(token.dex_address);
    // JSON.parse(JSON.stringify(tokens_accounts_result)).forEach(item =>{
    //   token_total_issuance.plus(item.free)
    // })
    if (token.id == "BNC-dex") {
      const tokens_accounts_result = await Promise.all(token.dex_address.map(async (item) => {
        const result = await api.query.system.account(item);
        return result
      }));
      JSON.parse(JSON.stringify(tokens_accounts_result)).forEach(item => {
        token_total_issuance = new BigNumber(BigInt(item.data.free).toString())
      })
    } else {
      const tokens_accounts_result = await Promise.all(token.dex_address.map(async (item) => {
        const result = await api.query.tokens.accounts(JSON.parse(JSON.stringify(item))[0], JSON.parse(JSON.stringify(item))[1]);
        return result
        // token_total_issuance.plus(BigInt(JSON.parse(JSON.stringify(result)).free).toString())
      }));
      JSON.parse(JSON.stringify(tokens_accounts_result)).forEach(item => {
        token_total_issuance = new BigNumber(BigInt(item.free).toString())
      })
    }
    record.total_issuance = BigInt((token_total_issuance.toFixed()));
    record.usd = parseFloat(token_price.usd);
    record.cny = parseFloat(token_price.cny);
    const tvlNum = new BigNumber(token_price.usd).multipliedBy(token_total_issuance);
    record.tvl_native = BigInt(tvlNum.toFixed(0));
    record.tvl = parseFloat(tvlNum.div("1e+" + token.decimal).toFixed(2));
    record.isdex = true;
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


