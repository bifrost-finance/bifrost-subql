export default {
  rpc: {
    getFeeTokenAndAmount: {
      description: "Get charging token type and amount in terms of flexible transaction fee.",
      params: [
        {
          name: "who",
          type: "AccountId",
        },
        {
          name: "extrinsic",
          type: "Bytes",
        },
        {
          name: "at",
          type: "BlockHash",
          isHistoric: true,
          isOptional: true,
        },
      ],
      type: "(CurrencyId, NumberOrHex)",
    },
  },
  types: {
    PalletBalanceOf: "Balance",
    BlockNumberFor: "BlockNumber",
    NumberOrHex: {
      _enum: {
        Number: "u64",
        Hex: "U256",
      },
    },
  },
};
