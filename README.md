# @lumine-code/jasmine-tagged

Filters legacy Jasmine specs by inherited tags for Lumine test suites.

> [!WARNING]
> **This package is deprecated.** [Lumine](https://github.com/lumine-code/lumine) no longer depends on it — the test harness no longer filters specs by inherited tags. This repository is archived and no longer maintained.

## Features

- **Inline tags**: recognizes `#tag` words in suite and spec descriptions.
- **Inherited tags**: applies tags from parent suites to their nested specs.
- **Selective runs**: includes only specs matching the configured tag list.
- **Untagged control**: optionally includes or excludes specs without tags.
- **Focused integration**: composes with the Lumine focused Jasmine runner.

## Installation

```sh
npm install @lumine-code/jasmine-tagged
```

## Usage

```js
require('@lumine-code/jasmine-tagged')

const env = jasmine.getEnv()
env.setIncludedTags(['windows'])
env.includeSpecsWithoutTags(false)
```

Tags are written in descriptions, such as `describe('filesystem #windows', () => {})`.

## Building

```sh
npm install
npm test
```

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
