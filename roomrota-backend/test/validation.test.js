const test = require("node:test");
const assert = require("node:assert/strict");
const { emailAddress, optionalDate, password, requiredString } = require("../src/utils/validation");

test("normalizes user-controlled strings", () => {
  assert.equal(requiredString("  Clean Kitchen  ", "title"), "Clean Kitchen");
  assert.equal(emailAddress("  USER@Example.com "), "user@example.com");
});

test("rejects malformed input with a client error", () => {
  assert.throws(() => password("short"), (error) => error.statusCode === 400);
  assert.throws(() => optionalDate("not-a-date"), (error) => error.code === "VALIDATION_ERROR");
});
