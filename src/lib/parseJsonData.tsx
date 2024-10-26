/**
 * Parses a JSON string into a JavaScript object with no BigInts
 * @param data - JSON string
 * @returns JavaScript object
 */
export function parseJsonData(data: object): any {
  const dataString = JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value,
  );
  const dataJSON = JSON.parse(dataString);
  return dataJSON;
}
