import { SubstrateEvent, SubstrateBlock } from "@subql/types";
import axiosOriginal from 'axios';
import adapter from 'axios/lib/adapters/http';
const axios = axiosOriginal.create({ adapter });

function getDayStartUnix(block: SubstrateBlock): string {
  let timestamp = block.timestamp.getTime() / 1000
  let dayIndex = Math.floor(timestamp / 3600 / 24) // get unique hour within unix history
  let dayStartUnix = dayIndex * 3600 * 24 // want the rounded effect
  return dayStartUnix.toString()
}

function get7DayStartUnix(block: SubstrateBlock): string {
  let timestamp = block.timestamp.getTime() / 1000 - 604800;
  let dayIndex = Math.floor(timestamp / 3600 / 24) // get unique hour within unix history
  let day7StartUnix = dayIndex * 3600 * 24 // want the rounded effect
  return day7StartUnix.toString()
}

// function getUnix(block: SubstrateBlock): string {
//   let timestamp = block.timestamp.getTime()
//   return timestamp.toString()
// }

function tokenSplit(tokenName: string): string[] {
  const substring = "v";
  if (tokenName.includes(substring)) {
    const words = tokenName.split(substring);
    return [words[1], tokenName, 'vToken']
  } else {
    return [tokenName, "v" + tokenName, 'token']
  }
}

let prices = [];

export interface Price {
  date: string;
  coin_id: string;
  cny: string;
  usd: string;
}

async function getPrice(block: SubstrateBlock, coin_id: string): Promise<Price> {
  const date = `${block.timestamp.getDate()}-${block.timestamp.getMonth()}-${block.timestamp.getFullYear()}`;
  const price = prices.filter(price => price.date == date && price.coin_id == coin_id);
  if (price.length === 0) {
    logger.info("Request")
    const url = "https://api.coingecko.com/api/v3/coins/" + coin_id + "/history?date=" + date;
    const result = await axios.get(url);
    const p = {
      date: date,
      coin_id: coin_id,
      cny: result.data.market_data ? result.data.market_data.current_price.cny : '0',
      usd: result.data.market_data ? result.data.market_data.current_price.usd : '0',
    }
    prices.push(p)
    return p as Price
  }
  return price[0]
}

export { getDayStartUnix, get7DayStartUnix, tokenSplit, getPrice };