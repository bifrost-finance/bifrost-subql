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

async function postSlack(account: string, text: string, to?: string) {
  if (to === null) {
    options.text = text +
      '\naccount: ' + account.toString() + '```';
    await axios.post('https://slack.com/api/chat.postMessage', options);
  }
  const monitor = monitor_address.find(value => account === value.address)
  const cex = cex_address.find(value => to === value.address)
  if (monitor !== undefined && cex !== undefined) {
    options.text = text +
      '\nfrom: ' + account.toString() + ' ' + monitor.mark +
      '\nto: ' + to.toString() + ' CEX```';
    await axios.post('https://slack.com/api/chat.postMessage', options);
  } else if (monitor !== undefined && cex === undefined) {
    options.text = text +
      '\nfrom: ' + account.toString() + ' ' + monitor.mark +
      '\nto: ' + to.toString() + '```';
    await axios.post('https://slack.com/api/chat.postMessage', options);
  } else if (monitor === undefined && cex !== undefined) {
    options.text = text +
      '\nfrom: ' + account.toString() +
      '\nto: ' + to.toString() + ' CEX```';
    await axios.post('https://slack.com/api/chat.postMessage', options);
  }
}

export { getDayStartUnix, get7DayStartUnix, tokenSplit, postSlack };