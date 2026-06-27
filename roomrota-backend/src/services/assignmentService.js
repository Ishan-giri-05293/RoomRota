const normalizedCount = (value) => (Number.isFinite(value) ? value : 0);

const selectAssignee = (users, choreTitle) => {
  const eligible = users.filter((user) => user && user.isAvailable !== false);
  if (eligible.length === 0) return null;

  return [...eligible].sort((a, b) => {
    const workloadDifference =
      normalizedCount(a.currentChoreCount) - normalizedCount(b.currentChoreCount);
    if (workloadDifference !== 0) return workloadDifference;

    const aRepeated = a.lastChore === choreTitle ? 1 : 0;
    const bRepeated = b.lastChore === choreTitle ? 1 : 0;
    if (aRepeated !== bRepeated) return aRepeated - bRepeated;

    const aAssignedAt = a.lastAssignedAt?.toMillis?.() || 0;
    const bAssignedAt = b.lastAssignedAt?.toMillis?.() || 0;
    if (aAssignedAt !== bAssignedAt) return aAssignedAt - bAssignedAt;

    return a.uid.localeCompare(b.uid);
  })[0];
};

module.exports = { selectAssignee };
