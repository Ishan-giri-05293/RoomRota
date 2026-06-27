const test = require("node:test");
const assert = require("node:assert/strict");
const { selectAssignee } = require("../src/services/assignmentService");

test("selects the available user with the lowest workload", () => {
  const selected = selectAssignee(
    [
      { uid: "a", isAvailable: true, currentChoreCount: 3 },
      { uid: "b", isAvailable: true, currentChoreCount: 1 },
      { uid: "c", isAvailable: false, currentChoreCount: 0 },
    ],
    "Dishes"
  );
  assert.equal(selected.uid, "b");
});

test("avoids repeating the same chore when workloads are equal", () => {
  const selected = selectAssignee(
    [
      { uid: "a", isAvailable: true, currentChoreCount: 1, lastChore: "Dishes" },
      { uid: "b", isAvailable: true, currentChoreCount: 1, lastChore: "Trash" },
    ],
    "Dishes"
  );
  assert.equal(selected.uid, "b");
});

test("returns null when nobody is available", () => {
  assert.equal(selectAssignee([{ uid: "a", isAvailable: false }], "Dishes"), null);
});
