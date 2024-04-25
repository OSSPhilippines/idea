# Idea Transformer

A programmatical command line interface used by projects and that calls 
on external transformers to make relevant code.

## Install

```bash
$ npm install @ossph/idea-transformer

... or ...

$ yarn add @ossph/idea-transformer
```

## Custom Terminal

Create a bin file and paste this basic example.

```js
#!/usr/bin/env node

const { Terminal } = require('@ossph/idea-transformer');
new Terminal().run();
```

You can whitelabel `idea` like the following. This will prefix all 
outputs with `[MY LIB]` and schema files now need to have the 
extension `.mylib`.

```js
#!/usr/bin/env node

const { Terminal } = require('@ossph/idea-transformer');
Terminal.brand = '[MY LIB]';
Terminal.extension = 'mylib';
new Terminal().run();
```

## Programmatically Transform

You can also call the transformer manually like the following example.

```js
const { Loader, Transformer } = require('@ossph/idea-transformer');

const cwd = __dirname;
const idea = Loader.absolute('./my.idea', cwd);

const transformer = new Transformer(idea, cwd);
//read raw schema data
const schema = transformer.schema;
//transform schema
transformer.transform();
```

See [https://github.com/OSSPhilippines/idea] for more info.
