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

export const numberToLetter = (num: number): string => {
  // Ensure the number is within the valid range (0-25)
  if (num < 0 || num > 25) {
    throw new Error('Number out of range. Must be between 0 and 25.');
  }

  // Convert the number to the corresponding letter
  const letter = String.fromCharCode(65 + num);
  return letter;
}