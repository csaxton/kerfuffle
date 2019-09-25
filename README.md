# kerfuffle

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

generate as many of these plans as you'd like. when you are ready to affect the changes run:

```bash
kerfuffle apply . --plan .myfirst-changes.json
```

when done, push your branches up to the origin; create pull requests and do your thing
