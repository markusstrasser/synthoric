class DebugInfo {
  info = $state<Record<string, unknown>>({})
}
export function clearDebugInfo() {
  debug.info = {}
}
export function setDebugInfo(info: any) {
  debug.info = info
}
const debug = new DebugInfo()

export default debug
