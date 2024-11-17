/**
 * Splits a string into chunks of a maximum number of bytes
 * @param str - The string to split
 * @param byteLimit - The maximum number of bytes per chunk
 * @returns An array of strings
 */
export function splitStringByBytes(str: string, byteLimit = 64): string[] {
  const result = [];
  let currentChunk = '';
  let currentBytes = 0;

  for (const char of str) {
    const charBytes = new Blob([char]).size;

    if (currentBytes + charBytes > byteLimit) {
      result.push(currentChunk);
      currentChunk = char;
      currentBytes = charBytes;
    } else {
      currentChunk += char;
      currentBytes += charBytes;
    }
  }

  if (currentChunk) {
    result.push(currentChunk);
  }

  return result;
}
