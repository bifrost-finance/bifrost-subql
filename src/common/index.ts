import { SubstrateEvent, SubstrateBlock } from "@subql/types";

function getDayStartUnix(block: SubstrateBlock): string {
  let timestamp = block.timestamp.getTime() / 1000
  let dayIndex = Math.floor(timestamp / 3600 / 24) // get unique hour within unix history
  let dayStartUnix = dayIndex * 3600 * 24 // want the rounded effect
  return dayStartUnix.toString()
}

function getUnix(block: SubstrateBlock): string {
  let timestamp = block.timestamp.getTime()
  return timestamp.toString()
}

export { getDayStartUnix, getUnix };