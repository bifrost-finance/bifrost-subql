import { SubstrateBlock } from "@subql/types";
import { Balance, AccountData, AccountId } from "@polkadot/types/interfaces";
// import { CurrencyId } from "@bifrost-finance/types/interfaces";
import { getDayStartUnix, get7DayStartUnix, tokenSplit } from '../common';

// export async function bancor(block: SubstrateBlock): Promise<void> {
//   // if (block.block.header.number.toNumber() % 10 !== 0) { return }
//   logger.info('fdfdf');
//   logger.info(api.query);
//   logger.info(await api.query);
//   const b2 = await api.rpc.chain.getBlock();
//   logger.info(b2.block.header.number.toNumber());
//   let b = await api.rpc.zenlinkProtocol.getAllAssets();
//   logger.info(b[0].chain_id)

//   logger.info('----');

//   // api.createType(types);
//   let c = await api.rpc.rpc.methods();
//   logger.info(c);
// }
