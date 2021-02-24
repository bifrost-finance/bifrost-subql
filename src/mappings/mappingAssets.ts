import { SubstrateExtrinsic, SubstrateEvent } from "@subql/types";
import { SignedBlock, Balance, Moment, AssetId, Token, u16, TokenType } from "@bifrost-finance/types/interfaces";
import { SubstrateBlock } from "@subql/types";

import { VtokenPool, Compact } from '@bifrost-finance/types';
import { assetsTransferredCount } from "../types/models/assetsTransferredCount";
import { dailyMintPrice } from "../types/models/dailyMintPrice";
import { assetsToken } from "../types/models/assetsToken";

function createSumassetsTransferredCount(index: string): assetsTransferredCount {
  const entity = new assetsTransferredCount(index);
  entity.transferredCount = BigInt(0);
  return entity;
}

const ONE_BI = BigInt(1);

// export async function eventBalancesTransfer(event: SubstrateEvent): Promise<void> {
//   let timestamp = event.block.timestamp.getTime() / 1000
//   let dayIndex = Math.floor(timestamp / 3600 / 24) // get unique hour within unix history
//   let dayStartUnix = dayIndex * 3600 * 24 // want the rounded effect
//   const { event: { data: [accountFrom, accountTo, balance] } } = event;
//   let record = await assets.get(dayStartUnix.toString());
//   console.log('test4-----')
//   if (record === undefined) {
//     await createSumAssets(dayStartUnix.toString()).save();
//   } else {
//     // const record = await starterEntity.get(event.extrinsic.block.block.header.hash.toString());
//     record.transferredCount = record.transferredCount + ONE_BI;
//     // record.field4 = (balance as Balance).toBigInt();
//     // record.field5 = dayStartUnix.toString()
//     await record.save();
//   }
// }

export async function assetsCreatedEvent(event: SubstrateEvent): Promise<void> {
  const { event: { data: [id, token1] } } = event;
  let record = new assetsToken(event.extrinsic.block.block.header.hash.toString());

  let token = (await api.query.assets.tokens(id as AssetId)) as Token;
  record.symbol = (token.symbol as AssetId).toString();
  record.precision = (token.precision as u16).toNumber();
  record.total_supply = (token.total_supply as Balance).toBigInt();
  record.token_type = (token.token_type as TokenType).toString();
  await record.save();
}

export async function assetsTransferredEvent(event: SubstrateEvent): Promise<void> {
  let timestamp = event.block.timestamp.getTime() / 1000
  let dayIndex = Math.floor(timestamp / 3600 / 24) // get unique hour within unix history
  let dayStartUnix = dayIndex * 3600 * 24 // want the rounded effect
  const { event: { data: [asset_id, account_from, account_to, balance] } } = event;
  const asset_id_str = (asset_id as AssetId).toString();
  let record = await assetsTransferredCount.get(asset_id_str + dayStartUnix.toString());
  if (record === undefined) {
    await createSumassetsTransferredCount(asset_id_str + dayStartUnix.toString()).save();
  } else {
    record.transferredCount = record.transferredCount + ONE_BI;
    await record.save();
  }
}