import { SubstrateBlock } from "@subql/types";
import { CurrencyId, Balance } from "@bifrost-finance/types/interfaces";
import { VtokenPool, Compact } from '@bifrost-finance/types';
import { getDayStartUnix } from '../common';
import { mintPriceDayData } from "../types/models/mintPriceDayData";
import { apr } from "../types/models/apr";
import { revenue } from "../types/models/revenue";

const tokens = ["BNC", "aUSD", "DOT", "vDOT", "KSM", "vKSM", "ETH", "vETH", "EOS", "vEOS", "IOST", "vIOST"];

export async function vtokenPoolBlock(block: SubstrateBlock): Promise<void> {
  for (let i = 0; i < tokens.length; i++) {
    const currency_id = tokens[i];
    let recordDailyMintPrice = await mintPriceDayData.get(currency_id + '@' + getDayStartUnix(block));
    if (recordDailyMintPrice === undefined) { // 如果此块所处当日还未记录mintprice（说明此块是当日第一个块），则记录一下
      const token_pool = ((await api.query.assets.totalIssuance(({
        "Token": currency_id
      }) as CurrencyId).catch(e => { console.log(e) })) as Balance).toBigInt();
      let recordmintPriceDayData = new mintPriceDayData(currency_id + '@' + getDayStartUnix(block));
      recordmintPriceDayData.pool = token_pool;
      recordmintPriceDayData.currencyId = currency_id;
      recordmintPriceDayData.time = block.timestamp;
      recordmintPriceDayData.blockHeight = block.block.header.number.toBigInt();
      await recordmintPriceDayData.save().catch(e => { console.log(e) });
    } else if (recordDailyMintPrice.time.getTime() < block.timestamp.getTime()) {
      const token_pool = ((await api.query.assets.totalIssuance(({
        "Token": currency_id
      }) as CurrencyId).catch(e => { console.log(e) })) as Balance).toBigInt();
      const recordDailyMintPrice = await mintPriceDayData.get(currency_id + '@' + getDayStartUnix(block));
      recordDailyMintPrice.pool = token_pool;
      recordDailyMintPrice.currencyId = currency_id;
      recordDailyMintPrice.time = block.timestamp;
      recordDailyMintPrice.blockHeight = block.block.header.number.toBigInt();
      await recordDailyMintPrice.save().catch(e => { console.log(e) });
    }
  }
}

export async function aprBlock(block: SubstrateBlock): Promise<void> {
  for (let i = 0; i < tokens.length; i++) {
    const currency_id = tokens[i];
    let aprResult = await apr.get(currency_id);
    if (aprResult === undefined) {
      let recordApr = new apr(currency_id);
      recordApr.apr = '0';
      recordApr.time = block.timestamp;
      recordApr.blockHeight = block.block.header.number.toBigInt();
      await recordApr.save().catch(e => { console.log(e) });
    } else if (aprResult.time.getTime() < block.timestamp.getTime()) {
      let aprResult = await apr.get(currency_id);
      aprResult.apr = '0';
      aprResult.time = block.timestamp;
      aprResult.blockHeight = block.block.header.number.toBigInt();
      await aprResult.save().catch(e => { console.log(e) });
    }
  }
}

export async function revenueBlock(block: SubstrateBlock): Promise<void> {
  for (let i = 0; i < tokens.length; i++) {
    const currency_id = tokens[i];
    let revenueResult = await revenue.get(currency_id);
    if (revenueResult === undefined) {
      let recordRevenue = new revenue(currency_id);
      recordRevenue.revenue = '0';
      recordRevenue.time = block.timestamp;
      recordRevenue.blockHeight = block.block.header.number.toBigInt();
      await recordRevenue.save().catch(e => { console.log(e) });
    } else if (revenueResult.time.getTime() < block.timestamp.getTime()) {
      // const recordDailyMintPrice = await mintPriceDayData.get(currency_id + '@' + getDayStartUnix(block));
      revenueResult.revenue = '0';
      revenueResult.time = block.timestamp;
      revenueResult.blockHeight = block.block.header.number.toBigInt();
      await revenueResult.save().catch(e => { console.log(e) });
    }
  }
}