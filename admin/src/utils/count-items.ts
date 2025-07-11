export function countItems(data: any): number {
  if (Array.isArray(data)) {
    // checking if data is array, then count summary of element
    return data.length;
  } else if (typeof data === "object" && data !== null) {
    // checking if data is object property 'count' or 'totalCount'
    if ("count" in data) return data.count;
    if ("totalCount" in data) return data.totalCount;
  }
  return 0; // if there are not matched data, return 0
}
