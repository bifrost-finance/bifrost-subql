import { SubstrateEvent, SubstrateBlock } from "@subql/types";
import { Tokens } from "../mappings/mappingHandlers";
import axiosOriginal from "axios";
import adapter from "axios/lib/adapters/http";
import BigNumber from "bignumber.js";
const axios = axiosOriginal.create({ adapter });

let prices = [
{date:"26-1-2024",coin_id:"kusama",cny:"254.78262529537113",usd:"35.93244934072877"},
{date:"26-1-2024",coin_id:"manta-network",cny:"21.01737355195555",usd:"2.9641177829740095"},
{date:"26-1-2024",coin_id:"moonbeam",cny:"2.5082616818988326",usd:"0.3537446311876055"},
{date:"26-1-2024",coin_id:"astar",cny:"1.2147779129779321",usd:"0.1713223017767091"},
{date:"26-1-2024",coin_id:"polkadot",cny:"45.63197286724048",usd:"6.435558749222969"},
{date:"29-1-2024",coin_id:"kusama",cny:"273.27687147220684",usd:"38.507815151382076"},
{date:"30-1-2024",coin_id:"kusama",cny:"285.3276298211321",usd:"40.218145016721685"},
{date:"31-1-2024",coin_id:"kusama",cny:"276.89422906651606",usd:"38.976679532455265"},
{date:"29-1-2024",coin_id:"polkadot",cny:"48.42124300286082",usd:"6.823103122153361"},
{date:"30-1-2024",coin_id:"polkadot",cny:"50.155973796961746",usd:"7.069698188309496"},
{date:"31-1-2024",coin_id:"polkadot",cny:"48.64931456194139",usd:"6.848061621027475"},
{date:"1-2-2024",coin_id:"kusama",cny:"268.54505666383113",usd:"37.81792094970158"},
{date:"1-2-2024",coin_id:"polkadot",cny:"47.21717271601138",usd:"6.649369485426186"},
{date:"2-2-2024",coin_id:"kusama",cny:"269.2853931079334",usd:"37.93553470563264"},
{date:"2-2-2024",coin_id:"polkadot",cny:"48.191350101931356",usd:"6.788948383733377"},
];

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
  const date = `${block.timestamp.getDate()}-${block.timestamp.getMonth() + 1
    }-${block.timestamp.getFullYear()}`;
  const price = prices.filter(
    (price) => price.date == date && price.coin_id == coin_id
  );
  let yesterday = new Date(block.timestamp);
  yesterday.setDate(block.timestamp.getDate() - 1);
  const yesterday_date = `${yesterday.getDate()}-${yesterday.getMonth() + 1
    }-${yesterday.getFullYear()}`;
  const price2 = prices.filter(
    (price) => price.date == yesterday_date && price.coin_id == coin_id
  );
  if (price.length === 0) {
    logger.info(`Request:${date} ${coin_id}`);
    let p = {
      date: date,
      coin_id: coin_id,
      cny: "0",
      usd: "0",
    };
    let now = new Date();
    let now_date = `${now.getDate()}-${now.getMonth() + 1
      }-${now.getFullYear()}`;
    let token_info = Tokens.filter(i => i.coin_id == coin_id);
    if (date === now_date && token_info.length != 0) {
      const url =
        "https://api.bifrost.app/api/dapp/prices";
      const result = await axios.get(url);
      p.usd = result.data.prices[token_info[0].token.toLowerCase()].toString();
      prices.push(p);
      return p as Price;
    }
    const url =
      "https://api.coingecko.com/api/v3/coins/" +
      coin_id +
      "/history?date=" +
      date;
    const result = await axios.get(url);
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
    case 2307:
      return { name: "vASTR", coin_id: "astar", decimal: 18 };
    case 2051:
      return { name: "ASTR", coin_id: "astar", decimal: 18 };
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
    case "ASTR":
      return { token2: "3" };
    case "MANTA":
      return { token2: "8" };
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
    case "vASTR":
      return { vToken2: "3" };
    case "vASTR":
      return { vToken2: "8" };
    case "vFIL":
      return { vToken2: "4" };
    case "vsDOT":
      return { vsToken2: "0" };
    default:
      throw new Error("not found");
  }
}

export { getPrice, getZenlinkTokenName, toUnitToken, assetTypeFormat };
