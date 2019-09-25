const generateCommitMessage = (chance, conventional = false) => {
  const preamble = conventional
    ? `${chance.pickone([
        "fix",
        "feat",
        "chore",
        "refactor",
        "docs",
        "test",
        "ci",
      ])}: `
    : "";

  return `${preamble}${chance.sentence()}`;
};

module.exports = {
  generateCommitMessage,
};
