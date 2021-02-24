import { SubstrateBlock } from "@subql/types";
import { AssetId, Token } from "@bifrost-finance/types/interfaces";
import { VtokenPool, Compact } from '@bifrost-finance/types';
import { getDayStartUnix } from '../common';
import { vtokenPool } from "../types/models/vtokenPool";
import { dailyMintPrice } from "../types/models/dailyMintPrice";

export async function vtokenPoolBlock(block: SubstrateBlock): Promise<void> {
  const asset_ids = ((await api.query.assets.nextAssetId()) as AssetId).toNumber();

  [...Array(asset_ids).keys()].forEach(async (asset_id) => {
    const token_type = ((await api.query.assets.tokens(asset_id)
      .catch(e => { console.log(e) })) as Token).token_type.toString();
    if (token_type == 'VToken') { // 如果是vtoken则跳过
      return;
    }
    let record = new vtokenPool(asset_id.toString() + '@' + block.block.header.hash.toString());
    let pool = (await api.query.vtokenMint.pool(asset_id).catch(e => { console.log(e) })) as VtokenPool;
    record.vtokenPool = BigInt(pool.vtoken_pool * Math.pow(10, 12));
    record.tokenPool = BigInt(pool.token_pool * Math.pow(10, 12));
    if (record.tokenPool == BigInt(0)) {
      record.mintPrice = BigInt(0);
    } else {
      record.mintPrice = BigInt((pool.vtoken_pool / pool.token_pool) * Math.pow(10, 12));
    }
    await record.save().catch(e => { console.log(e) });

    let recordDailyMintPrice = await dailyMintPrice.get(asset_id.toString() + '@' + getDayStartUnix(block))
      .catch(e => { console.log(e) });
    if (recordDailyMintPrice === undefined) { // 如果此块所处当日还未记录mintprice（说明此块是当日第一个块），则记录一下
      let recordDailyMintPrice = new dailyMintPrice(asset_id.toString() + '@' + getDayStartUnix(block));
      recordDailyMintPrice.mintPrice = record.mintPrice;
      await recordDailyMintPrice.save().catch(e => { console.log(e) });
    }
  });
}