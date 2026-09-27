import { test } from "node:test";
import assert from "node:assert/strict";

import { main } from "../src/index.ts";

test("main is callable", () => {
  assert.equal(typeof main, "function");
});
