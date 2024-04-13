# Idea Transform

A programmatical command line interface used by projects and that calls 
on external transformers to make relevant code.

## Install

```bash
$ npm install @ossph/idea-transform

... or ...

$ yarn add @ossph/idea-transform
```

## Usage

Create a bin file and paste this basic example.

```js
#!/usr/bin/env node

const { Terminal } = require('@ossph/idea-transform');
new Terminal().run();
```

You can whitelabel `idea` like the following. This will prefix all 
outputs with `[MY LIB]` and schema files now need to have the 
extension `.mylib`.

```js
#!/usr/bin/env node

const { Terminal } = require('@ossph/idea-transform');
Terminal.brand = '[MY LIB]';
Terminal.extension = 'mylib';
new Terminal().run();
```

You can also manually trigger generators that were not included in the 
schema file like the following.

```js
#!/usr/bin/env node

const { Terminal } = require('@ossph/idea-transform');
const terminal = new Terminal();
terminal.generate('/location/to/generator.js', { custom: 'config' });
```

> Not calling `run()` wont trigger any of the generators in the schema file.

See [https://github.com/OSSPhilippines/idea] for more info.
