import { SubstrateBlock } from "@subql/types";
import { BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import BigNumber from "bignumber.js";

export async function handleTokenHolders(block: SubstrateBlock): Promise<void> {
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  ).toBigInt();
  logger.info(123);

  if (new BigNumber(blockNumber.toString()).modulo(300).toNumber() === 0) {
    logger.info(23123);

    const bncAccounts = await api.query.tokens.accounts.entries();
    logger.info(bncAccounts);
    await Promise.all(
      bncAccounts.map(async (bncAccount) => {
        logger.info(bncAccount);
      })
    );

    const tokenAccounts = await api.query.system.account.entries();
    logger.info(tokenAccounts);
  }
  return;
}
