import { SubstrateBlock } from "@subql/types";

export async function rpcTest(block: SubstrateBlock): Promise<void> {
  logger.info('======');
  const b2 = await api.rpc.chain.getBlock();
  logger.info(b2.block.header.number.toNumber());
  // let b = await api.rpc.zenlinkProtocol.getAllAssets();
  // logger.info(b[0].chain_id);
  let c = await api.rpc.rpc.methods();
  logger.info(c);
  logger.info('------');
}