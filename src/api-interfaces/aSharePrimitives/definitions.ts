export default {
  rpc: {},
  types: {
    TokenSymbol: {
      _enum: {
        ASG: 0,
        aUSD: 2,
        DOT: 3,
        KSM: 4,
        ETH: 5,
      },
    },
    CurrencyId: {
      _enum: {
        Token: "TokenSymbol",
        VToken: "TokenSymbol",
        Native: "TokenSymbol",
        Stable: "TokenSymbol",
        VSToken: "TokenSymbol",
        VSBond: "(TokenSymbol, ParaId, LeasePeriod, LeasePeriod)",
      },
    },
    CurrencyIdOf: "CurrencyId",
    TAssetBalance: "Balance",
    AmountOf: "i128",
    // ChainId: {
    //   _enum: {
    //     RelayChain: "Null",
    //     ParaChain: "ParaId",
    //   },
    // },
    // XCurrencyId: {
    //   chainId: "ChainId",
    //   currencyId: "Vec<u8>",
    // },
    StorageVersion: "Releases",
    ShareWeight: "Balance",
  },
};
