export default {
    rpc: {},
    types: {
        OrderId: "u64",
        OrderInfo: {
            owner: "AccountIdOf",
            currency_sold: "CurrencyIdOf",
            amount_sold: "BalanceOf",
            currency_expected: "CurrencyIdOf",
            amount_expected: "BalanceOf",
            order_id: "OrderId",
            order_state: "OrderState"
        },
        OrderState: {
            _enum: ["InTrade", "Revoked", "Clinchd"],
        }
    },
  };
