import { SubstrateEvent, SubstrateBlock } from "@subql/types";
import axiosOriginal from "axios";
import adapter from "axios/lib/adapters/http";
import BigNumber from "bignumber.js";
const axios = axiosOriginal.create({ adapter });

let prices = [];

export interface Price {
  date: string;
  coin_id: string;
  cny: string;
  usd: string;
}

async function getPrice(
  block: SubstrateBlock,
  coin_id: string
): Promise<Price> {
  const date = `${block.timestamp.getDate()}-${
    block.timestamp.getMonth() + 1
  }-${block.timestamp.getFullYear()}`;
  const price = prices.filter(
    (price) => price.date == date && price.coin_id == coin_id
  );
  let yesterday = new Date(block.timestamp);
  yesterday.setDate(block.timestamp.getDate() - 1);
  const yesterday_date = `${yesterday.getDate()}-${
    yesterday.getMonth() + 1
  }-${yesterday.getFullYear()}`;
  const price2 = prices.filter(
    (price) => price.date == yesterday_date && price.coin_id == coin_id
  );
  if (price.length === 0) {
    logger.info(`Request:${date} ${coin_id}`);
    const url =
      "https://api.coingecko.com/api/v3/coins/" +
      coin_id +
      "/history?date=" +
      date;
    const result = await axios.get(url);
    let p = {
      date: date,
      coin_id: coin_id,
      cny: "0",
      usd: "0",
    };
    if (result.data.market_data) {
      // If today's price exists, update usd and cny fields.
      p.cny = result.data.market_data.current_price.cny;
      p.usd = result.data.market_data.current_price.usd;
      prices.push(p);
    } else if (price2.length !== 0) {
      // If only today's price do not exist, return yesterday's price.
      return price2[0];
    } else {
      const price3 = prices.filter((price) => price.coin_id == coin_id);
      if (price3.length !== 0) {
        const old_price = price3.pop();
        p.cny = old_price.cny;
        p.usd = old_price.usd;
      }
    }
    return p as Price;
  }
  return price[0];
}

function getZenlinkTokenName(assetIndex: number): {
  name?: string;
  coin_id?: string;
  decimal?: number;
} {
  switch (assetIndex) {
    case 0:
      return { name: "BNC", coin_id: "bifrost-native-coin", decimal: 12 };
    case 2048:
      return { name: "DOT", coin_id: "polkadot", decimal: 10 };
    case 517:
      return { name: "ETH", coin_id: "ethereum", decimal: 18 };
    case 519:
      return { name: "ZLK", coin_id: "zenlink-network-token", decimal: 18 };
    case 770:
      return { name: "kUSD", coin_id: "tether", decimal: 12 };
    case 2304:
      return { name: "vDOT", coin_id: "polkadot", decimal: 10 };
    case 2560:
      return { name: "vsDOT", coin_id: "polkadot", decimal: 10 };

    case 2049:
      return { name: "vGLMR", coin_id: "moonbeam", decimal: 18 };
    case 2305:
      return { name: "GLMR", coin_id: "moonbeam", decimal: 18 };
    case 2308:
      return { name: "vFIL", coin_id: "filecoin", decimal: 18 };
    case 2052:
      return { name: "FIL", coin_id: "filecoin", decimal: 18 };
    default:
      return {};
  }
}

function toUnitToken(balance: string, decimals): number {
  if (balance) {
    const base = new BigNumber(10).pow(new BigNumber(decimals || 12));
    const dm = new BigNumber(balance).div(base).toString();
    return parseFloat(dm);
  }
  return 0;
}

function assetTypeFormat(asset) {
  switch (asset) {
    case "USDT":
      return { ForeignAsset: 0 };
    case "BNC":
    case "ASG":
      return { native: asset };
    case "kUSD":
      return { stable: asset };
    case "DOT":
      return { token2: "0" };
    case "GLMR":
      return { token2: "1" };
    case "FIL":
      return { token2: "4" };
    case "KAR":
    case "ZLK":
    case "RMRK":
    case "PHA":
    case "TUR":
    case "CSM":
    case "CRAB":
      return { token: asset };
    case "vDOT":
      return { vToken2: "0" };
    case "vGLMR":
      return { vToken2: "1" };
    case "vFIL":
      return { vToken2: "4" };
    case "vsDOT":
      return { vsToken2: "0" };
    default:
      throw new Error("not found");
  }
}

export { getPrice, getZenlinkTokenName, toUnitToken, assetTypeFormat };
