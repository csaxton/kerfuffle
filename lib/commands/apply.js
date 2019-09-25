const path = require("path");
const fs = require("fs-extra");
const Chance = require("chance");
const nodegit = require("nodegit");

exports.command = "apply <repository>";

exports.describe = "applies a plan to the specified repository";

exports.builder = yargs =>
  yargs
    .positional("repository", {
      describe: "the path the to local repository to subject to churning",
      type: "string",
      demandOption: true,
    })
    .option("plan", {
      alias: "p",
      describe: "the path the plan you wish to apply",
      type: "string",
    })
    .option("development-branch", {
      describe:
        "the branch of primary development (i.e. where features are merged into)",
      type: "string",
      default: "develop",
    })
    .coerce({
      repository: path.resolve,
      plan: value => fs.readJsonSync(path.resolve(value)),
    });

exports.handler = async function(argv) {
  console.log(`applying ${argv.plan.length} branch(es) ...`);
  const chance = new Chance();
  const repository = await nodegit.Repository.open(argv.repository);
  const committer = await nodegit.Signature.default(repository);
  for (let p = 0; p < argv.plan.length; p++) {
    const session = argv.plan[p];
    console.log("session", session.id, session.branch);

    await repository.checkoutBranch(argv.developmentBranch);

    const devHead = await repository.getHeadCommit();

    await repository.createBranch(session.branch, devHead);
    await repository.checkoutBranch(session.branch);

    for (let c = 0; c < session.commits.length; c++) {
      const commit = session.commits[c];

      commit.changes.forEach(applyChange(chance, argv.repository, commit.id));

      await repository.createCommitOnHead(
        commit.changes.map(({ subject }) => subject),
        committer,
        committer,
        commit.message,
      );
    }

    await repository.checkoutBranch(argv.developmentBranch);
  }
};

const applyChange = (chance, repositoryPath, identifier) => ({
  action,
  subject,
  content = "",
}) => {
  const changeContent =
    content ||
    `\n<${identifier}>${chance.paragraph.call(chance, {
      sentences: 2,
    })}<${identifier}>`;
  const absSubject = path.join(repositoryPath, subject);
  console.log("applying change", action, absSubject);
  switch (action) {
    case "edit":
      fs.appendFileSync(absSubject, changeContent);
      break;

    case "create":
      fs.outputFileSync(absSubject, changeContent);
      break;
  }
};
