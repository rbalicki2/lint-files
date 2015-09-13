# lint-files

> A POC for git-commit-and-lint

## Setup

```sh
git clone https://github.com/rbalicki2/gulp-git-show
cd gulp-git-show
sudo cp ./src/gulp-git-show /usr/bin/
sudo chmod +x /usr/bin/gulp-git-show

# add the git config hooks
git config --add lint.allFiles "gulp lint --staged"
git config --add line.specificFiles "gulp lint --staged --files"
```

(I'll make a real installer at some point...)

## Usage

```sh
git commit-and-lint
# or
git commit-and-lint -f
```

For now, `-m` and other flags you would expect `git commit` to have aren't implemented.

## How it should work

* It looks in your `git log` for the phrase `passed-lint`.
* If found, it runs `git config lint.specificFiles`
* ONLY on the files that have changed since that commit.
* If not found, it runs `git config lint.allFiles`.

If lint passes, it will make a commit and append `passed-lint` to your commit message.

## -f (force)

If there's nothing in your staging area, `git commit-and-lint` will not create a new, empty commit unless you include the `-f` flag.

If there are no files changed since the last time, git commit will not create an empty commit unless you include the `-f` flag.

## Things to consider

Your `git config lint.allFiles` and `git config lint.specificFiles` should lint the files in the staging area.

`gulp-git-show.js` has a bug: if a file exists in the staging area but was deleted in the working directory, it won't be included in lint. It could fail lint in the staging area.

`git-commit-and-lint` has a bug: if your staging area reverts all changes to the last commit in which `passed-lint` is present, `git commit-and-lint -f` will only create a "placeholder" commit even though you might want to include a commit message.