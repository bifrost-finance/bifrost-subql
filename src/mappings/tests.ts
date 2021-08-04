import { SubstrateBlock } from "@subql/types";
import {PairInfo} from "bifrost-subql/api-interfaces";
import {Vec} from "@polkadot/types";

export async function rpcTest(block: SubstrateBlock): Promise<void> {
  logger.info('======');
  const b2 = await api.rpc.chain.getBlock();
  logger.info(b2.block.header.number.toNumber());
  let pairs = await api.rpc.zenlinkProtocol.getAllPairs() as Vec<PairInfo>;
  for (const pair of pairs){
    logger.info(`pair: ${pair.toString()}`);
  }
  // let c = await api.rpc.rpc.methods();
  // logger.info(c);
  logger.info('------');
}