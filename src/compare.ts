import { Diff } from "./types";

/**
 * Returns all the keys that are different between A and B
 *
 * @param a
 * @param b
 */
export const compareKeys = (
  a: Record<string, any>,
  b: Record<string, any>
): Diff => {
  const aOnly = Object.keys(a).filter(
    (key) => !Object.prototype.hasOwnProperty.call(b, key)
  );

  const bOnly = Object.keys(b).filter(
    (key) => !Object.prototype.hasOwnProperty.call(a, key)
  );

  const both = Object.keys(b).filter((key) =>
    Object.prototype.hasOwnProperty.call(a, key)
  );

  return {
    a: aOnly,
    b: bOnly,
    both: both,
  };
};
