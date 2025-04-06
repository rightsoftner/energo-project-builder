export const getFastDeepObjectCopy = (obj: Object) => {
  return JSON.parse(JSON.stringify(obj));
}

export const  cleanString = (input: string): string => {
  // Trim the string to remove leading and trailing whitespace
  let cleaned = input.trim();

  // Replace multiple spaces with a single space
  cleaned = cleaned.replace(/\s+/g, ' ');

  // Remove newline characters
  cleaned = cleaned.replace(/\n/g, ' ');

  return cleaned;
}