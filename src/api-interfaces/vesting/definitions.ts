export default {
    rpc: {},
    types: {
        MaxLocksOf: "u32",
        VestingInfo: {
            locked: "Balance",
            per_block: "Balance",
            starting_block: "BlockNumber"
        }
    },
  };