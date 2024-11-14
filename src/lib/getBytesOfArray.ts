/**
 * Calculate the size of an array in bytes
 * @param array - The array to calculate the size of
 * @returns Number of bytes
 */
export function getBytesOfArray(array: unknown[]): number {
  // Convert the array to a JSON string and calculate the size in bytes
  const jsonString = JSON.stringify(array);
  return new Blob([jsonString]).size;
}
