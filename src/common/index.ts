import { SubstrateEvent, SubstrateBlock } from "@subql/types";
import axiosOriginal from "axios";
import adapter from "axios/lib/adapters/http";
import BigNumber from "bignumber.js";
const axios = axiosOriginal.create({ adapter });

function getDayStartUnix(block: SubstrateBlock): string {
  let timestamp = block.timestamp.getTime() / 1000;
  let dayIndex = Math.floor(timestamp / 3600 / 24); // get unique hour within unix history
  let dayStartUnix = dayIndex * 3600 * 24; // want the rounded effect
  return dayStartUnix.toString();
}

function get7DayStartUnix(block: SubstrateBlock): string {
  let timestamp = block.timestamp.getTime() / 1000 - 604800;
  let dayIndex = Math.floor(timestamp / 3600 / 24); // get unique hour within unix history
  let day7StartUnix = dayIndex * 3600 * 24; // want the rounded effect
  return day7StartUnix.toString();
}

// function getUnix(block: SubstrateBlock): string {
//   let timestamp = block.timestamp.getTime()
//   return timestamp.toString()
// }

function tokenSplit(tokenName: string): string[] {
  const substring = "v";
  if (tokenName.includes(substring)) {
    const words = tokenName.split(substring);
    return [words[1], tokenName, "vToken"];
  } else {
    return [tokenName, "v" + tokenName, "token"];
  }
}

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
    case 260:
      return { name: "vKSM", coin_id: "kusama", decimal: 12 };
    case 515:
      return { name: "DOT", coin_id: "polkadot", decimal: 10 };
    case 516:
      return { name: "KSM", coin_id: "kusama", decimal: 12 };
    case 517:
      return { name: "ETH", coin_id: "ethereum", decimal: 18 };
    case 518:
      return { name: "KAR", coin_id: "karura", decimal: 12 };
    case 519:
      return { name: "ZLK", coin_id: "zenlink-network-token", decimal: 18 };
    case 521:
      return { name: "RMRK", coin_id: "rmrk", decimal: 10 };
    case 522:
      return { name: "MOVR", coin_id: "moonriver", decimal: 18 };
    case 770:
      return { name: "kUSD", coin_id: "tether", decimal: 12 };
    case 1027:
      return { name: "vsDOT", decimal: 10 };
    case 1028:
      return { name: "vsKSM", decimal: 12 };
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

export {
  getDayStartUnix,
  get7DayStartUnix,
  tokenSplit,
  getPrice,
  getZenlinkTokenName,
  toUnitToken,
};
