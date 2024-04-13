<div align="center">
  <h1>💡 Idea</h1>
  <a href="https://www.npmjs.com/package/@ossph/idea"><img src="https://img.shields.io/npm/v/@ossph/idea.svg?style=flat" /></a>
  <a href="https://github.com/OSSPhilippines/idea/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <a href="https://github.com/OSSPhilippines/idea/commits/main/"><img src="https://img.shields.io/github/last-commit/OSSPhilippines/idea" /></a>
  <a href="https://github.com/OSSPhilippines/idea/blob/main/docs/contribute.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <br />
  <br />
  <a href="https://github.com/OSSPhilippines/idea/blob/main/docs/schema.md">Form an Idea</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/OSSPhilippines/idea/blob/main/docs/transform.md">Transform an Idea</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://marketplace.visualstudio.com/items?itemName=ossph.idea-langugage">Code Extension</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/OSSPhilippines/idea/blob/main/docs/contribute.md">Contribute</a>
  <br />
  <hr />
</div>

A meta language to express and transform your ideas to reality. 
It all starts with an idea...

## Install

```bash
$ npm i -D @ossph/idea
```

## Usage

This is an example idea schema.

```js
//my.idea
model Product @label("Product" "Products") @suggested("[name]") @icon("gift") {
  name        String   @label("Name") 
                       @field.text
                       @is.required("Name is required")
                       @list.detail @view.text

  image       String   @label("Image") 
                       @field.image
                       @list.image({ width 20 height 20 }) 
                       @view.image({ width 100 height 100 })

  description String   @label("Description") 
                       @field.textarea
                       @list.none @view.text
  
  currency    String   @label("Currency")
                       @filterable @default("USD")
                       @field.currency
                       @is.ceq(3 "Should be valid currency prefix")
                       @list.text @view.text
  
  srp         Float?   @label("SRP")
                       @min(0.00) @step(0.01)
                       @field.number({ min 0.00 step 0.01 })
                       @list.price @view.price
  
  price       Float?   @label("Offer Price")
                       @min(0.00) @step(0.01)
                       @field.number({ min 0.00 step 0.01 })
                       @list.price @view.price
}
```

> "Ideas are worthless without execution" - Many People

To transform an idea, you need to plugin a transformer like the 
following example.

```js
//my.idea
plugin "@ossph/idea-typescript" {
  ts true
  output "./src/types.ts"
}
// ... your idea ...
// model Product ...
```

You can use other ideas, just import them like the following example.

```js
//my.idea
use "./another.idea"
// ... your idea ...
// model Product ...
```

To execute an idea, you just need to run the following command.

```bash
$ npx idea -i my.idea
```

Learn more:

 - [Form an Idea](//github.com/OSSPhilippines/idea/blob/main/docs/schema.md)
 - [Transform an Idea](//github.com/OSSPhilippines/idea/blob/main/docs/transform.md)
