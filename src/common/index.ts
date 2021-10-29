import { SubstrateEvent, SubstrateBlock } from "@subql/types";
import { monitor_address, cex_address } from './vestingAddress';
import axiosOriginal from 'axios';
import adapter from 'axios/lib/adapters/http';
const axios = axiosOriginal.create({
  adapter, headers: {
    'Authorization': ''
  }
});

const options = {
  'channel': '',
  'text': ''
};

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

function isMonitorAddress(account: string): boolean {
  const address = monitor_address.find(value => account = value.address)
  if (address === undefined) { return false }
  else { return true }
}

function isCexAddress(account: string): boolean {
  const address = cex_address.find(value => account = value.address)
  if (address === undefined) { return false }
  else { return true }
}

async function postSlack(account: string, text: string, to?: string, cex_text?: string) {
  if (isMonitorAddress(account.toString()) === true) {
    options.text = text;
    await axios.post('https://slack.com/api/chat.postMessage', options);
  }
  if (isCexAddress(to.toString()) === true) {
    options.text = cex_text;
    await axios.post('https://slack.com/api/chat.postMessage', options);
  }
}

export { getDayStartUnix, get7DayStartUnix, tokenSplit, postSlack };