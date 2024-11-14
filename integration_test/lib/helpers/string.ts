export default function removeAllSpaces(inputStr: string): string {
  return inputStr.replace(/\s/g, '');
}

export function extractPollIdFromUrl(url: string): number {
  return parseInt(url.split('/').pop());
}
