type ConvertBigIntToString<T> = T extends bigint
  ? string
  : T extends Array<infer U>
    ? Array<ConvertBigIntToString<U>>
    : T extends object
      ? { [K in keyof T]: ConvertBigIntToString<T[K]> }
      : T;

/**
 *
 * @param obj - Object with BigInts
 * @returns Same object but with BigInts converted to Strings
 */
export function convertBigIntsToStrings<T>(obj: T): ConvertBigIntToString<T> {
  if (typeof obj === 'bigint') {
    return String(obj) as ConvertBigIntToString<T>;
  } else if (Array.isArray(obj)) {
    return obj.map((item) =>
      convertBigIntsToStrings(item),
    ) as ConvertBigIntToString<T>;
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        convertBigIntsToStrings(value),
      ]),
    ) as ConvertBigIntToString<T>;
  } else {
    return obj as ConvertBigIntToString<T>;
  }
}
