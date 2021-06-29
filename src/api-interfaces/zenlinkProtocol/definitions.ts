export default {
  rpc: {
      getAllAssets: {
          description: 'zenlinkProtocol getAllAssets',
          params: [{
              name: 'at',
              type: 'Hash',
              isOptional: true
          }],
          type: 'Vec<ZenlinkAssetId>'
      },
      getBalance: {
          description: 'zenlinkProtocol getBalance',
          params: [{
              name: 'asset_id',
              type: 'ZenlinkAssetId'
          }, {
              name: 'account',
              type: 'AccountId'
          }, {
              name: 'at',
              type: 'Hash',
              isOptional: true
          }],
          type: 'String'
      },
      getSovereignsInfo: {
          description: 'Get the ownership of a certain currency for each parachain.',
          params: [{
              name: 'asset_id',
              type: 'ZenlinkAssetId'
          }, {
              name: 'at',
              type: 'BlockHash',
              isHistoric: true,
              isOptional: true
          }],
          type: '(u32, AccountId, String)'
      },
      getAllPairs: {
          description: 'Get the information of all the exchange pairs.',
          params: [{
              name: 'at',
              type: 'BlockHash',
              isHistoric: true,
              isOptional: true
          }],
          type: 'Vec<PairInfo>'
      },
      getOwnerPairs: {
          description: 'Get ownership of all exchange pairs for a particular account.',
          params: [{
              name: 'owner',
              type: 'AccountId'
          }, {
              name: 'at',
              type: 'BlockHash',
              isHistoric: true,
              isOptional: true
          }],
          type: 'Vec<PairInfo>'
      },
      getPairByAssetId: {
          description: 'Get the detailed information of a particular exchange pair.',
          params: [{
              name: 'asset_0',
              type: 'ZenlinkAssetId'
          }, {
              name: 'asset_1',
              type: 'ZenlinkAssetId'
          }, {
              name: 'at',
              type: 'BlockHash',
              isHistoric: true,
              isOptional: true
          }],
          type: 'PairInfo'
      },
      getAmountInPrice: {
          description: 'Get the output token amount for an exact input token amount.',
          params: [{
              name: 'supply',
              type: 'ZenlinkAssetBalance'
          }, {
              name: 'path',
              type: 'Vec<ZenlinkAssetId>'
          }, {
              name: 'at',
              type: 'BlockHash',
              isHistoric: true,
              isOptional: true
          }],
          type: 'u128'
      },
      getAmountOutPrice: {
          description: 'Get the input token amount for an exact output token amount.',
          params: [{
              name: 'supply',
              type: 'ZenlinkAssetBalance'
          }, {
              name: 'path',
              type: 'Vec<ZenlinkAssetId>'
          }, {
              name: 'at',
              type: 'BlockHash',
              isHistoric: true,
              isOptional: true
          }],
          type: 'u128'
      },
      getEstimateLptoken: {
          description: 'Get the estimated number of LP token acquired given the desired and minimum amount for both in-token and out-token.',
          params: [{
              name: 'asset_0',
              type: 'ZenlinkAssetId'
          }, {
              name: 'asset_1',
              type: 'ZenlinkAssetId'
          }, {
              name: 'amount_0_desired',
              type: 'ZenlinkAssetBalance'
          }, {
              name: 'amount_1_desired',
              type: 'ZenlinkAssetBalance'
          }, {
              name: 'amount_0_min',
              type: 'ZenlinkAssetBalance'
          }, {
              name: 'amount_1_min',
              type: 'ZenlinkAssetBalance'
          }, {
              name: 'at',
              type: 'BlockHash',
              isHistoric: true,
              isOptional: true
          }],
          type: 'u128'
      }
  },
  types: {
      ZenlinkAssetId: {
          'chain_id': 'u32',
          'asset_type': 'u8',
          'asset_index': 'u32'
      },
      ZenlinkAssetBalance: 'u128',
      PairInfo: {
          asset0: 'ZenlinkAssetId',
          asset1: 'ZenlinkAssetId',
          account: 'AccountId',
          totalLiquidity: 'ZenlinkAssetBalance',
          holdingLiquidity: 'ZenlinkAssetBalance',
          reserve0: 'ZenlinkAssetBalance',
          reserve1: 'ZenlinkAssetBalance',
          lpAssetId: 'ZenlinkAssetId'
      },
      TokenSymbol: {
          '_enum': {
              ASG: 0,
              aUSD: 2,
              DOT: 3,
              KSM: 4,
              ETH: 5
          }
      },
      CurrencyId: {
          '_enum': {
              Token: 'TokenSymbol',
              VToken: 'TokenSymbol',
              Native: 'TokenSymbol',
              Stable: 'TokenSymbol',
              VSToken: 'TokenSymbol',
              VSBond: '(TokenSymbol, ParaId, LeasePeriod, LeasePeriod)'
          }
      },
      CurrencyIdOf: 'CurrencyId',
      PalletBalanceOf: 'Balance',
      BlockNumberFor: 'BlockNumber',
      NumberOrHex: {
          '_enum': {
              Number: 'u64',
              Hex: 'U256'
          }
      },
      IsExtended: 'bool',
      SystemPalletId: 'PalletId',
      RewardRecord: {
          'account_id': 'AccountId',
          'record_amount': 'Balance'
      },
      MaxLocksOf: 'u32',
      OrderId: 'u64',
      OrderInfo: {
          owner: 'AccountIdOf',
          'currency_sold': 'CurrencyIdOf',
          'amount_sold': 'BalanceOf',
          'currency_expected': 'CurrencyIdOf',
          'amount_expected': 'BalanceOf',
          'order_id': 'OrderId',
          'order_state': 'OrderState'
      },
      OrderState: {
          '_enum': ['InTrade', 'Revoked', 'Clinchd']
      }
  },
  typesAlias: {
      AccountData: {
          free: 'Balance',
          reserved: 'Balance',
          frozen: 'Balance'
      },
      VestingInfo: {
          locked: 'Balance',
          'per_block': 'Balance',
          'starting_block': 'BlockNumber'
      },
      TAssetBalance: 'Balance',
      ZenlinkProtocol: {
          AssetBalance: 'ZenlinkAssetBalance',
          AssetId: 'ZenlinkAssetId'
      }
  }
}