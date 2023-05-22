import { assert } from "chai";

import { range } from "../src/utils/range";

suite("range utility", () => {
  test("should return a range of numbers", () => {
    const result = range(5);
    const expected = [1, 2, 3, 4, 5];
    assert.deepEqual(result, expected);
  });
});
