import { SubstrateExtrinsic, SubstrateEvent } from "@subql/types";
import { StarterEntity } from "../types/models/StarterEntity";
import { Balance } from "@polkadot/types/interfaces";
import { SubstrateBlock } from "@subql/types";
import { getPrice } from "../common";
import { Tvl, Extrinsic, DemocracyInfo, CouncilInfo } from "../types/models";
import BigNumber from "bignumber.js";

const Tokens = [
  {
    id: "vsKSM",
    coin_id: "kusama",
    currency: { vsToken: "KSM" },
    decimal: 12,
  },
  {
    id: "vsDOT",
    coin_id: "polkadot",
    currency: { vsToken: "DOT" },
    decimal: 10,
  },
  {
    id: "vKSM",
    coin_id: "kusama",
    currency: { vToken: "KSM" },
    decimal: 12,
    token: "KSM",
  },
  {
    id: "vMOVR",
    coin_id: "moonriver",
    currency: { vToken: "MOVR" },
    decimal: 18,
    token: "MOVR",
  },
  {
    id: "vBNC",
    coin_id: "bifrost-native-coin",
    currency: { vToken: "BNC" },
    decimal: 12,
    token: "BNC",
  },
];

const DexTokens = [
  {
    id: "KSM-dex",
    coin_id: "kusama",
    currency: { Token: "KSM" },
    decimal: 12,
    dex_address: [
      ["eCSrvaystgdffuJxPVYKf8H8UYnHGNRdVGUvj1SWSiatWMq", { Token: "KSM" }],
      ["eCSrvaystgdffuJxPVU9u7Vv2AVjXTAEwbuujLggS6t6HoE", { Token: "KSM" }],
      ["eCSrvaystgdffuJxPVTJc2eQMgp9PnuPh7mMaQ6KbTynFRM", { Token: "KSM" }],
      ["eCSrvaystgdffuJxPVZUZmUBqiz2nXKWuUWHQBPqvJFeDh1", { Token: "KSM" }],
      ["eCSrvaystgdffuJxPVW4UMxAXMuTpU3jkCJeiqppyfoi6SG", { Token: "KSM" }],
    ],
  },
  {
    id: "ZLK-dex",
    coin_id: "zenlink-network-token",
    currency: { Token: "ZLK" },
    decimal: 18,
    dex_address: [
      ["eCSrvaystgdffuJxPVRWqnxeKZJ3dWu8qJYidgLLStXXkiG", { Token: "ZLK" }],
      ["eCSrvaystgdffuJxPVU5NQfnXRohvjWF9u8VaeUWRg1mn1y", { Token: "ZLK" }],
    ],
  },
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
      if (token.id === "vKSM" || token.id === "vMOVR" || token.id === "vBNC") {
        token_total_issuance = await api.query.vtokenMinting?.tokenPool(
          token.id === "vBNC"
            ? { Native: "BNC" }
            : {
                token: token.token,
              }
        );
      } else {
        token_total_issuance = await api.query.tokens.totalIssuance(
          token.currency
        );
      }

      record.total_issuance = (token_total_issuance as Balance).toBigInt();
      record.usd = parseFloat(token_price.usd);
      record.cny = parseFloat(token_price.cny);
      const tvlNum = new BigNumber(token_price.usd).multipliedBy(
        token_total_issuance.toString()
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
      // const tokens_accounts_result= await api.query.tokens.accounts.multi(token.dex_address);
      // JSON.parse(JSON.stringify(tokens_accounts_result)).forEach(item =>{
      //   token_total_issuance.plus(item.free)
      // })

      const tokens_accounts_result = await Promise.all(
        token.dex_address.map(async (item) => {
          const result = await api.query.tokens.accounts(
            JSON.parse(JSON.stringify(item))[0],
            JSON.parse(JSON.stringify(item))[1]
          );
          return result;
          // token_total_issuance.plus(BigInt(JSON.parse(JSON.stringify(result)).free).toString())
        })
      );
      JSON.parse(JSON.stringify(tokens_accounts_result)).forEach((item) => {
        token_total_issuance = new BigNumber(BigInt(item.free).toString())
          .multipliedBy(2)
          .plus(token_total_issuance);
      });

      record.total_issuance = BigInt(token_total_issuance.toFixed());
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

export async function handleEvent(event: SubstrateEvent): Promise<void> {
  const {
    event: {
      data: [account, balance],
    },
  } = event;
  //Retrieve the record by its ID
  const record = await StarterEntity.get(
    event.extrinsic.block.block.header.hash.toString()
  );
  record.field2 = account.toString();
  //Big integer type Balance of a transfer event
  record.field3 = (balance as Balance).toBigInt();
  await record.save();
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
  const record = await StarterEntity.get(
    extrinsic.block.block.header.hash.toString()
  );
  //Date type timestamp
  record.field4 = extrinsic.block.timestamp;
  await record.save();
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
  ) as unknown as SubstrateEvent[];
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
  ) as unknown as SubstrateEvent[];
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
