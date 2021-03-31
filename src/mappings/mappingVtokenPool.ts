import { SubstrateBlock } from "@subql/types";
import { CurrencyId, Balance } from "@bifrost-finance/types/interfaces";
import { VtokenPool, Compact } from '@bifrost-finance/types';
import { getDayStartUnix, get7DayStartUnix, tokenSplit } from '../common';
import { mintPriceDayData } from "../types/models/mintPriceDayData";
import { apr } from "../types/models/apr";
import { revenue } from "../types/models/revenue";

const tokens = ["BNC", "aUSD", "DOT", "vDOT", "KSM", "vKSM", "ETH", "vETH", "EOS", "vEOS", "IOST", "vIOST"];
const vTokens = ["vDOT", "vKSM", "vETH", "vEOS", "vIOST"];
const unit = BigInt(1000000000000)

export async function vtokenPoolBlock(block: SubstrateBlock): Promise<void> {
  for (let i = 0; i < tokens.length; i++) {
    const currency_id = tokens[i];
    const [currency_id_token, currency_id_vtoken, token_type] = tokenSplit(currency_id);
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
      if (token_type === 'token') {
        let vtoken = await mintPriceDayData.get(currency_id_vtoken + '@' + getDayStartUnix(block));
        if (vtoken === undefined || vtoken.pool === BigInt(0)) { recordmintPriceDayData.price = BigInt(0); }
        else { recordmintPriceDayData.price = recordmintPriceDayData.pool * unit / vtoken.pool }
      } else if (token_type === 'vToken') {
        let token = await mintPriceDayData.get(currency_id_token + '@' + getDayStartUnix(block));
        if (token === undefined || recordmintPriceDayData.pool === BigInt(0)) { recordmintPriceDayData.price = BigInt(0); }
        else { recordmintPriceDayData.price = token.pool * unit / recordmintPriceDayData.pool }
      }
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
      if (token_type === 'token') {
        let vtoken = await mintPriceDayData.get(currency_id_vtoken + '@' + getDayStartUnix(block));
        if (vtoken === undefined || vtoken.pool === BigInt(0)) { recordDailyMintPrice.price = BigInt(0); }
        else { recordDailyMintPrice.price = recordDailyMintPrice.pool * unit / vtoken.pool }
      } else if (token_type === 'vToken') {
        let token = await mintPriceDayData.get(currency_id_token + '@' + getDayStartUnix(block));
        if (token === undefined || recordDailyMintPrice.pool === BigInt(0)) { recordDailyMintPrice.price = BigInt(0); }
        else { recordDailyMintPrice.price = token.pool * unit / recordDailyMintPrice.pool }
      }
      await recordDailyMintPrice.save().catch(e => { console.log(e) });
    }
  }
}

export async function aprBlock(block: SubstrateBlock): Promise<void> {
  for (let i = 0; i < vTokens.length; i++) {
    const currency_id = vTokens[i];
    let aprResult = await apr.get(currency_id);
    if (aprResult === undefined) {
      let recordApr = new apr(currency_id);
      recordApr.apr = BigInt(0);
      recordApr.time = block.timestamp;
      recordApr.blockHeight = block.block.header.number.toBigInt();
      await recordApr.save().catch(e => { console.log(e) });
    } else if (aprResult.time.getTime() < block.timestamp.getTime()) {
      const recordDailyMintPrice = await mintPriceDayData.get(currency_id + '@' + get7DayStartUnix(block));
      if (recordDailyMintPrice === undefined) { aprResult.apr = BigInt(0); }
      else {
        const recordDailyMintPrice1 = await mintPriceDayData.get(currency_id + '@' + getDayStartUnix(block));
        aprResult.apr = (recordDailyMintPrice1.price - recordDailyMintPrice.price) * unit / BigInt(7) / recordDailyMintPrice.price * BigInt(365);
      }
      aprResult.time = block.timestamp;
      aprResult.blockHeight = block.block.header.number.toBigInt();
      await aprResult.save().catch(e => { console.log(e) });
    }
  }
}

export async function revenueBlock(block: SubstrateBlock): Promise<void> {
  for (let i = 0; i < vTokens.length; i++) {
    const currency_id = vTokens[i];
    const [currency_id_token, currency_id_vtoken] = tokenSplit(currency_id);

    let revenueResult = await revenue.get(currency_id);
    if (revenueResult === undefined) {
      let recordRevenue = new revenue(currency_id);
      recordRevenue.revenue = BigInt(0);
      recordRevenue.time = block.timestamp;
      recordRevenue.blockHeight = block.block.header.number.toBigInt();
      await recordRevenue.save().catch(e => { console.log(e) });
    } else if (revenueResult.time.getTime() < block.timestamp.getTime()) {
      const tokenRecord = await mintPriceDayData.get(currency_id_token + '@' + getDayStartUnix(block));
      const vTokenRecord = await mintPriceDayData.get(currency_id_vtoken + '@' + getDayStartUnix(block));
      if (tokenRecord === undefined || vTokenRecord === undefined) { revenueResult.revenue = BigInt(0); }
      else {
        revenueResult.revenue = tokenRecord.pool - vTokenRecord.pool;
      }
      revenueResult.time = block.timestamp;
      revenueResult.blockHeight = block.block.header.number.toBigInt();
      await revenueResult.save().catch(e => { console.log(e) });
    }
  }
}