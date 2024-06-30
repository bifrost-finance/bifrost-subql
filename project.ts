import {
  SubstrateDatasourceKind,
  SubstrateHandlerKind,
  SubstrateProject,
} from "@subql/types";

// Can expand the Datasource processor types via the genreic param
const project: SubstrateProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "collator",
  description: "collator",
  runner: {
    node: {
      name: "@subql/node",
      version: ">=3.0.1",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  schema: {
    file: "./schema.graphql",
  },
  network: {
    chainId:
      "0x5e40ebe7e3fa1408a5ff66fee32d9a145d86791f927e085ab72e72c8740b1c68",
    endpoint: ["wss://bifrost.bifrost-staking-test.liebi.com/ws"],
  },
  dataSources: [
    {
      kind: SubstrateDatasourceKind.Runtime,
      startBlock: 1,
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleStakingErapaid",
            filter: {
              module: "parachainStaking",
              method: "NewRound",
            },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleStakingReward",
            filter: {
              module: "parachainStaking",
              method: "Rewarded",
            },
          },
        ],
      },
    },
  ],
};

// Must set default to the project instance
export default project;
