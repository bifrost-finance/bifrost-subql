import { SubstrateBlock } from "@subql/types";
import { CurrencyId, Balance } from "@bifrost-finance/types/interfaces";
import { VtokenPool, Compact } from '@bifrost-finance/types';
import { getDayStartUnix } from '../common';
import { mintPriceDayData } from "../types/models/mintPriceDayData";

export async function vtokenPoolBlock(block: SubstrateBlock): Promise<void> {
  const tokens = ["BNC", "aUSD", "DOT", "vDOT", "KSM", "vKSM", "ETH", "vETH", "EOS", "vEOS", "IOST", "vIOST"];
  tokens.forEach(async (currency_id) => {
    let recordDailyMintPrice = await mintPriceDayData.get(currency_id + '@' + getDayStartUnix(block))
      .catch(e => { console.log(e) });
    if (recordDailyMintPrice === undefined) { // 如果此块所处当日还未记录mintprice（说明此块是当日第一个块），则记录一下
      const token_pool = ((await api.query.assets.totalIssuance(({
        "Token": currency_id
      }) as CurrencyId).catch(e => { console.log(e) })) as Balance).toBigInt();
      let recordDailyMintPrice = new mintPriceDayData(currency_id + '@' + getDayStartUnix(block));
      recordDailyMintPrice.pool = token_pool;
      recordDailyMintPrice.currencyId = currency_id;
      recordDailyMintPrice.time = block.timestamp;
      recordDailyMintPrice.blockHeight = block.block.header.number.toBigInt();
      await recordDailyMintPrice.save().catch(e => { console.log(e) });
    }
  });
}