import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { Balance } from "@polkadot/types/interfaces";
import { getPrice, assetTypeFormat } from "../common";
import { Tvl, Extrinsic, DemocracyInfo, CouncilInfo } from "../types";
import BigNumber from "bignumber.js";

const Tokens = [
  {
    id: "vsDOT",
    coin_id: "polkadot",
    currency: { VSToken2: 0 },
    decimal: 10,
  },
  {
    id: "vDOT",
    coin_id: "polkadot",
    currency: { VToken2: 0 },
    decimal: 10,
    token: "DOT",
  },
  {
    id: "vGLMR",
    coin_id: "moonbeam",
    currency: { VToken2: 1 },
    decimal: 18,
    token: "GLMR",
  },
  {
    id: "vFIL",
    coin_id: "filecoin",
    currency: { VToken2: 4 },
    decimal: 18,
    token: "FIL",
  },
];

const DexTokens = [
  {
    id: "DOT-dex",
    coin_id: "polkadot",
    currency: { Token2: "0" },
    decimal: 10,
    dex_address: [
      ["eCSrvaystgdffuJxPVTne2cjBdWDh6yPvzt8RdkFdihjqS1", { Token2: "0" }],
      ["eCSrvaystgdffuJxPVRct68qJUZs1sFz762d7d37KJvb7Pz", { Token2: "0" }],
    ],
  },
  // {
  //   id: "ZLK-dex",
  //   coin_id: "zenlink-network-token",
  //   currency: { Token: "ZLK" },
  //   decimal: 18,
  //   dex_address: [
  //     ["eCSrvaystgdffuJxPVRWqnxeKZJ3dWu8qJYidgLLStXXkiG", { Token: "ZLK" }],
  //     ["eCSrvaystgdffuJxPVU5NQfnXRohvjWF9u8VaeUWRg1mn1y", { Token: "ZLK" }],
  //   ],
  // },
];

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  const blockNumber = block.block.header.number.toNumber();
  if (block.block.header.number.toNumber() % 100 !== 0) {
    return;
  }
  await Promise.all(
    Tokens.map(async (token) => {
      const token_price = await getPrice(block, token.coin_id);
      if (token_price.cny === "0") {
        return;
      }
      let record = new Tvl(blockNumber.toString() + "-" + token.id);
      record.block_height = block.block.header.number.toNumber();
      record.block_timestamp = block.timestamp;
      record.currency = JSON.stringify(token.currency);
      let token_total_issuance;
      if (['vGLMR', 'vDOT', 'vFIL'].includes(token.id)) {
        token_total_issuance = await api.query.vtokenMinting?.tokenPool(
          assetTypeFormat(token.token)
        );
      } else {
        token_total_issuance = await api.query.tokens?.totalIssuance(
          token.currency
        );
      }

      record.total_issuance = (token_total_issuance as Balance)?.toBigInt();
      record.usd = parseFloat(token_price.usd);
      record.cny = parseFloat(token_price.cny);
      const tvlNum = new BigNumber(token_price.usd).multipliedBy(
        token_total_issuance?.toString() || 0
      );
      // record.tvl = parseFloat(tvlNum.div(1e+12).toFixed(2).toString());
      record.tvl_native = BigInt(tvlNum.toFixed(0));
      record.tvl = parseFloat(tvlNum.div("1e+" + token.decimal).toFixed(2));
      record.isdex = false;
      await record.save();
    })
  );

  await Promise.all(
    DexTokens.map(async (token) => {
      const token_price = await getPrice(block, token.coin_id);
      if (token_price.cny === "0") {
        return;
      }
      let record = new Tvl(blockNumber.toString() + "-" + token.id);
      record.block_height = block.block.header.number.toNumber();
      record.block_timestamp = block.timestamp;
      record.currency = JSON.stringify(token.currency);
      let token_total_issuance = new BigNumber(0);

      const tokens_accounts_result = await Promise.all(
        token.dex_address.map(async (item) => {
          const result = await api.query.tokens?.accounts(
            JSON.parse(JSON.stringify(item))[0],
            JSON.parse(JSON.stringify(item))[1]
          );
          return result;
        })
      );

      JSON.parse(JSON.stringify(tokens_accounts_result))?.forEach((item) => {
        token_total_issuance = new BigNumber(
          item?.free ? BigInt(item.free).toString() : 0
        )
          .multipliedBy(2)
          .plus(token_total_issuance);
      });

      record.total_issuance = token_total_issuance
        ? BigInt(token_total_issuance.toFixed())
        : BigInt(0);
      record.usd = parseFloat(token_price.usd);
      record.cny = parseFloat(token_price.cny);
      const tvlNum = new BigNumber(token_price.usd).multipliedBy(
        token_total_issuance
      );
      record.tvl_native = BigInt(tvlNum.toFixed(0));
      record.tvl = parseFloat(tvlNum.div("1e+" + token.decimal).toFixed(2));
      record.isdex = true;
      await record.save();
    })
  );
}

export async function handleSignedBlock(block: SubstrateBlock): Promise<void> {
  const blockHash = block.block.header.hash.toString();
  const blockNumber = block.block.header.number.toNumber();

  await Promise.all(
    block.block.extrinsics.map(async (extrinsic) => {
      if (extrinsic.isSigned) {
        const origin = extrinsic.signer.toString();
        const record = new Extrinsic(extrinsic.hash.toString());
        record.block_hash = blockHash;
        record.block_height = blockNumber;
        record.block_timestamp = block.timestamp;
        record.origin = origin;
        await record.save();
      }
    })
  );
}

export async function democracy(block: SubstrateBlock): Promise<void> {
  const blockNumber = block.block.header.number.toNumber();
  const democracyEvents = block.events.filter(
    (e) => e.event.section === "democracy"
  ) as SubstrateEvent[];
  for (let democracyEvent of democracyEvents) {
    const {
      event: { data, section, method },
    } = democracyEvent;
    const record = new DemocracyInfo(
      blockNumber.toString() + "-" + democracyEvent.idx.toString()
    );
    record.event_id = democracyEvent.idx;
    record.extrinsic_id = democracyEvent.extrinsic
      ? democracyEvent.extrinsic.idx
      : null;
    record.block_height = blockNumber;
    record.block_timestamp = block.timestamp;
    record.method = method.toString();
    record.data = data.toString();
    await record.save();
  }
}

export async function council(block: SubstrateBlock): Promise<void> {
  const blockNumber = block.block.header.number.toNumber();
  const councilEvents = block.events.filter(
    (e) => e.event.section === "council"
  ) as SubstrateEvent[];
  for (let councilEvent of councilEvents) {
    const {
      event: { data, section, method },
    } = councilEvent;
    const record = new CouncilInfo(
      blockNumber.toString() + "-" + councilEvent.idx.toString()
    );
    record.event_id = councilEvent.idx;
    record.extrinsic_id = councilEvent.extrinsic
      ? councilEvent.extrinsic.idx
      : null;
    record.block_height = blockNumber;
    record.block_timestamp = block.timestamp;
    record.method = method.toString();
    record.data = data.toString();
    await record.save();
  }
}
