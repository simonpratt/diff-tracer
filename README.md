# Installation

- Install globally via npm
  `npm i -g diff-tracer`
- Run via command line
  `diff-tracer`

# Usage

`diff-tracer` can be used to generate a list of all files matching a glob search that have been impacted by the current diff against a selected git branch. Common usage would be to identify any test files that have either been changed or had some of their dependencies changed to identify tests requiring a re-run.

By default the command searches for test files using the pattern `**/*.test.ts` and compares the current changes to the `master` branch. To use a different search pattern or target a different branch, refer to the arguments section below or run `diff-tracer --help`.

## Command line arguments

The following command line arguments can be used to customise behaviour

| Flag     | Example      | Usage                                                    |   |   |
|----------|--------------|----------------------------------------------------------|---|---|
| --branch | master       | Specify a branch to compare your current changes against |   |   |
| --spec   | **/*.test.js | glob pattern to define which files you are interested in |   |   |
|          |              |                                                          |   |   |

# Contributing

## Development

To get the development environment setup
- Remove any existing install of `diff-tracer`
  `npm r -g diff-tracer`
- Install dependencies
  `npm ci`
- Run diff-tracer from source
  `npm start`

To install a local develoment version globally on your system
- Install dependencies
  `npm ci`
- Install globally
  `npm i -g .`
