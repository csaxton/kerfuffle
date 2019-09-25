# release process

standard gitflow procedures apply.

- checkout `release` branch from latest `develop` branch
- run `yarn release` to update changelog; version bump and tag
- when ready, merge `release` branch into `master`.

ci will publish package upon `master` merge and tests passing.
