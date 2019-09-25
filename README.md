# kerfuffle

[![CircleCI](https://circleci.com/gh/csaxton/kerfuffle.svg?style=svg)](https://circleci.com/gh/csaxton/kerfuffle) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

a little tool that allows you to create random churn in a local repository.

need to practice working with gitflow repositories and/or mono repos? this allows you to practice the management tasks

## install

install the tool right into your practice repository

`yarn add -D @muppets/kerfuffle`

## generate change/churn plans

you can generate and customise 'churn plans' that effectively describe the alterations that will be performed against your repository

```bash
kerfuffle plan . > .my-first-changes.json
```

generate as many of these plans as you'd like and modify their contents should you wish for something less random

## apply change/churn plans

when you are ready to affect the changes run:

```bash
kerfuffle apply . --plan .myfirst-changes.json
```

when done, push your branches up to the origin; create pull requests and do your thing
