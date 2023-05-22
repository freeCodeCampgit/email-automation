/**
 * Generates a range of numbers from 1 to end.
 *
 * @param {number} end The end of the range.
 * @returns {number[]} The range of numbers.
 */
export const range = (end: number) =>
  Array.from({ length: end }, (_, i) => i + 1);
