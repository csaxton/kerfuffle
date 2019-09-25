const path = require("path");
const glob = require("glob");
const Chance = require("chance");
const klawSync = require("klaw-sync");
const { generateCommitMessage } = require("../utils");

exports.command = "plan <repository>";

exports.describe = "generates a plan to affect random churn to a repository";

exports.builder = yargs =>
  yargs
    .positional("repository", {
      describe: "the path the to local repository to subject to churning",
      type: "string",
      demandOption: true,
    })
    .option("include", {
      describe:
        "glob specifying location(s) within repository where churn may be performed",
      alias: "i",
      type: "string",
      default: "/",
    })
    .coerce({
      repository: path.resolve,
    });

exports.handler = async function(argv) {
  const chance = new Chance();

  const churnDirectories = glob.sync(argv.include, {
    root: argv.repository,
  });

  const changeSpecs = chance.rpg("3d10").map(c => ({
    id: chance.guid(),
    branch: `feature/${chance.word()}`,
    commits: changesToCommits(
      chance,
      generateChanges(chance, argv.repository, churnDirectories, c),
    ),
  }));

  console.log(JSON.stringify(changeSpecs, null, 1));
};

const generateChanges = (
  chance,
  repository,
  churnDirectories,
  numberOfChanges,
) =>
  new Array(numberOfChanges).fill({}).map(change => {
    const churnDirectory = chance.pickone(churnDirectories);
    let action = chance.pickone(["edit", "create"]);
    if (action === "edit") {
      change.subject = selectRandomFile(chance, churnDirectory);
      if (!change.subject) {
        action = "create";
        change.subject = specifyRandomFile(chance, churnDirectory);
      }
    } else {
      change.subject = specifyRandomFile(chance, churnDirectory);
    }
    change.subject = path.relative(repository, change.subject);
    return { ...change, action };
  });

const changesToCommits = (chance, changes) => {
  const numberOfCommits = chance.integer({ min: 1, max: changes.length });
  let commits = new Array(numberOfCommits).fill([]);
  let c = 0;
  const rchanges = [...changes];
  while (rchanges.length > 0 && c < 100) {
    commits[chance.integer({ min: 0, max: numberOfCommits - 1 })].push(
      rchanges.pop(),
    );
  }
  return commits.map(c => ({
    id: chance.guid(),
    message: generateCommitMessage(chance),
    changes: c,
  }));
};

const selectRandomFile = (chance, baseDirectory) => {
  const files = klawSync(baseDirectory, {
    nodir: true,
    filter: excludeHidden,
  }).map(f => f.path);
  return files.length > 0 ? chance.pickone(files) : null;
};

const specifyRandomFile = (chance, baseDirectory) => {
  const directories = klawSync(baseDirectory, {
    nofile: true,
    filter: excludeHidden,
  }).map(d => d.path);

  const directory =
    directories.length > 0 ? chance.pickone(directories) : baseDirectory;

  return generateRandomPath(
    chance,
    directory,
    chance.weighted(["js", "md"], [10, 2]),
  );
};

const generateRandomPath = (chance, baseDirectory, extension) => {
  const depth = chance.weighted([1, 2, 3], [3, 2, 1]);
  return `${path.join(
    baseDirectory,
    ...new Array(depth).fill("").map(_ => chance.word()),
  )}.${extension}`;
};

const excludeHidden = ({ path: fpath }) =>
  !path.basename(fpath).startsWith(".") || path.basename(fpath) === ".";
