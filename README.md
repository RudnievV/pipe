# Pipe: Angular-like string pipes

> Angular-like string pipes

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [License](#license)

## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

```bash
$ npm install --save @rsol/pipe
```

## Usage

```js
import Pipe from '@rsol/pipe';
// or
const Pipe = require('@rsol/pipe').default;
// or
const { default: Pipe } = require('@rsol/pipe');
```

There are a list of possible handlers:

```ts
const handlers = {
  required: () => (str: string, initialValueString?: string) => {
    if (!str) {
      throw new PipeError(`Required value is empty: ${initialValueString}`);
    }
    return str;
  },
  toNull: () => (str: string) => str || null,
  toInt: () => (str: string) => (str ? +str : 0),
  toBool: () => (str: string) =>
    str === 'true' ? true : str === 'false' ? false : !!str,
  emptyStringToNull: () => (str: string) => (str === '' ? null : str),
  upper: () => (str: string) => str.toUpperCase(),
  lower: () => (str: string) => str.toLowerCase(),
  trim: () => (str: string) => str.trim(),
  trimEnd: () => (str: string) => str.trimEnd(),
  trimStart: () => (str: string) => str.trimStart(),
  at:
    (index = 0) =>
    (str: string) =>
      str.at(index),
  startsWith:
    (searchString: string = ' ', position?: number) =>
    (str: string) =>
      str.startsWith(searchString, position),
  endsWith:
    (searchString: string = '!', length?: number) =>
    (str: string) =>
      str.endsWith(searchString, length),
  includes:
    (searchString: string = ' ', position?: number) =>
    (str: string) =>
      str.includes(searchString, position),
  indexOf:
    (searchValue: string = ' ', fromIndex?: number) =>
    (str: string) =>
      str.indexOf(searchValue, fromIndex),
  lastIndexOf:
    (searchValue: string = ' ', fromIndex?: number) =>
    (str: string) =>
      str.lastIndexOf(searchValue, fromIndex),
  repeat:
    (count = 2) =>
    (str: string) =>
      str.repeat(count),
  replace:
    (searchValue: string = '  ', replaceValue: string = ' ') =>
    (str: string) =>
      str.replace(searchValue, replaceValue),
  padStart:
    (length = 10, fillString = '.') =>
    (str: string) =>
      str.padStart(length, fillString),
  padEnd:
    (length = 10, fillString = '.') =>
    (str: string) =>
      str.padEnd(length, fillString)
};
```

You can easily add your own handler:

```js
new Pipe().addHandler('equalOne', () => () => 1);
new Pipe().addHandler('addOne', () => (str) => +str + 1);
```

You can change the last handler, arguments delimiter, functions delimiter:

```js
new Pipe()
  .setLastHandler('addOne')
  .setArgDelimiter('|')
  .setFunctionDelimiter(':');
```

You can use it like this:

```js
const pipe = new Pipe();

pipe.pipeString('A|padEnd:2');
// 'A.'

const source = new Map([
  ['a', 'a|upper'],
  ['b', 'B|lower']
]);
const result = pipe.pipeMap(source);
// Map(2) { 'a' => 'A', 'b' => 'b' }

const source = new Set(['a|upper', 'b|lower']);
const result = pipe.pipeSet(source);
// Set(2) { 'A', 'b' }

const source = ['a|upper', 'b|lower'];
const result = pipe.pipeArray(source);
// [ 'A', 'b' ]

const source = { a: 'a|upper', b: 'b|lower' };
const result = pipe.pipeObject(source);
// { a: 'A', b: 'b' }
```

You can call only one method for all supported types:

```js
const pipe = new Pipe();

pipe.pipe('A|padEnd:2');
// 'A.'

const source = new Map([
  ['a', 'a|upper'],
  ['b', 'B|lower']
]);
const result = pipe.pipe(source);
// Map(2) { 'a' => 'A', 'b' => 'b' }

const source = new Set(['a|upper', 'b|lower']);
const result = pipe.pipe(source);
// Set(2) { 'A', 'b' }

const source = ['a|upper', 'b|lower'];
const result = pipe.pipe(source);
// [ 'A', 'b' ]

const source = { a: 'a|upper', b: 'b|lower' };
const result = pipe.pipe(source);
// { a: 'A', b: 'b' }
```

If you use wrong pipe string, you will get just a value:

```js
new Pipe().pipeString('1|wrongPipe');
// '1'
```

You can use chain of pipes:

```js
new Pipe().pipe('1|toInt|toBool');
// true
```

Usefully examples:

```js
const pipe = new Pipe();

// Get environment variable
pipe.addHandler('env', () => (str) => process.env[str]);
pipe.pipe('DB_PORT|env');

// get express request query parameter (`req` is a global variable)
pipe.addHandler('fromQuery', () => (name) => req.query[name]);
const { search, page, limit } = pipe.pipeObject({
  search: 'q|fromQuery|required',
  page: 'page|fromQuery|toInt',
  limit: 'limit|fromQuery|toInt'
});
```

## License

[MIT License](https://opensource.org/licenses/MIT) © Slava Rudnev
