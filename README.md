<h1 align=center>
  <a href="http://chaijs.com" title="Chai Documentation">
    <img alt="ChaiJS" src="http://chaijs.com/img/chai-logo.png"/> check-error
  </a>
</h1>

<p align=center>
  Error comparison and information related utility for <a href="http://nodejs.org">node</a> and the browser.
</p>

<p align=center>
  <a href="./LICENSE">
    <img
      alt="license:mit"
      src="https://img.shields.io/badge/license-mit-green.svg?style=flat-square"
    />
  </a>
  <a href="https://github.com/chaijs/check-error/releases">
    <img
      alt="tag:?"
      src="https://img.shields.io/github/tag/chaijs/check-error.svg?style=flat-square"
    />
  </a>
  <a href="https://travis-ci.org/chaijs/check-error">
    <img
      alt="build:?"
      src="https://img.shields.io/travis/chaijs/check-error/master.svg?style=flat-square"
    />
  </a>
  <a href="https://coveralls.io/r/chaijs/check-error">
    <img
      alt="coverage:?"
      src="https://img.shields.io/coveralls/chaijs/check-error/master.svg?style=flat-square"
    />
  </a>
  <a href="https://www.npmjs.com/packages/check-error">
    <img
      alt="npm:?"
      src="https://img.shields.io/npm/v/check-error.svg?style=flat-square"
    />
  </a>
  <a href="https://www.npmjs.com/packages/check-error">
    <img
      alt="dependencies:?"
      src="https://img.shields.io/npm/dm/check-error.svg?style=flat-square"
    />
  </a>
  <a href="">
    <img
      alt="devDependencies:?"
      src="https://img.shields.io/david/chaijs/check-error.svg?style=flat-square"
    />
  </a>
  <br/>
  <a href="https://saucelabs.com/u/chaijs-check-error">
    <img
      alt="Selenium Test Status"
      src="https://saucelabs.com/browser-matrix/chaijs-check-error.svg"
    />
  </a>
  <br>
  <a href="https://chai-slack.herokuapp.com/">
    <img
      alt="Join the Slack chat"
      src="https://img.shields.io/badge/slack-join%20chat-E2206F.svg?style=flat-square"
    />
  </a>
  <a href="https://gitter.im/chaijs/chai">
    <img
      alt="Join the Gitter chat"
      src="https://img.shields.io/badge/gitter-join%20chat-D0104D.svg?style=flat-square"
    />
  </a>
</p>

## What is Check-Error?

Check-Error is a module which you can use to retrieve an Error's information such as its `message` or `constructor` name and also to check whether two Errors are compatible based on their messages, constructors or even instances.

## Installation

### Node.js

`check-error` is available on [npm](http://npmjs.org). To install it, type:

    $ npm install check-error

### Browsers

You can also use it within the browser; install via npm and use the `check-error.js` file found within the download. For example:

```html
<script src="./node_modules/check-error/check-error.js"></script>
```

## Usage

The primary export of `check-error` is an object which has the following methods:

* `checkError(errObj[, errLike[, errMsgMatcher]])` or `checkError(errObj[, errMsgMatcher])` - Checks if an `Error` instance matches criteria defined by `errLike` and/or `errMsgMatcher`.
    * If `errLike` is a criteria object (as is returned by `.createCriteria`), then validate that `errObj` matches the criteria that was originally passed to `.createCriteria` in order to create the criteria object.
    * If `errLike` is omitted or is explicitly `null` or `undefined`, then it defaults to the built-in `Error` constructor.
    * If `errLike` is an `Error` constructor, then validate that `errObj` is an instance of `errLike`.
    * If `errLike` is an `Error` instance, then validate that `errObj` is strictly (`===`) equal to `errLike`.
    * If `errMsgMatcher` is a string or regex, then validate that `errObj`'s message includes or matches `errMsgMatcher`.
* `describeExpectedError([errLike[, errMsgMatcher]])` or `describeExpectedError[errMsgMatcher])` - Returns a string describing what kind of `Error` instance is expected based on criteria defined by `errLike` and/or `errMsgMatcher`.
* `createCriteria([errLike[, errMsgMatcher]])` or `createCriteria([errMsgMatcher])` - Returns a criteria object which can be passed to `.describeExpectedError` and `.checkError`. Doing so is more performant than directly passing the same `errLike` and/or `errMsgMatcher` to both of those functions.
* `compatibleMessage(err, errMatcher)` - Checks if an error's message is compatible with an `errMatcher` RegExp or String (we check if the message contains the String).
* `getConstructorName(errorLike)` - Retrieves the name of a constructor, an error's constructor or `errorLike` itself if it's not an error instance or constructor.
* `getMessage(err)` - Retrieves the message of an error. If `err` or `err.message` is undefined we return an empty String.

```js
var checkError = require('check-error');
```

#### .checkError(errObj[, errLike[, errMsgMatcher]]) or .checkError(errObj[, errMsgMatcher])

```js
var checkError = require('check-error');

var errObj = new TypeError('I like waffles');

checkError.checkError(errObj); // true
checkError.checkError({ message: 'I like waffles' }); // false

checkError.checkError(errObj, 'waffles'); // true
checkError.checkError(errObj, 'pancakes'); // false

checkError.checkError(errObj, /waffles/); // true
checkError.checkError(errObj, /pancakes/); // false

checkError.checkError(errObj, TypeError); // true
checkError.checkError(errObj, ReferenceError); // false

checkError.checkError(errObj, TypeError, 'waffles'); // true
checkError.checkError(errObj, TypeError, 'pancakes'); // false
checkError.checkError(errObj, ReferenceError, 'waffles'); // false

checkError.checkError(errObj, TypeError, /waffles/); // true
checkError.checkError(errObj, TypeError, /pancakes/); // false
checkError.checkError(errObj, ReferenceError, /waffles/); // false

checkError.checkError(errObj, errObj); // true
checkError.checkError(errObj, new TypeError('I like waffles')); // false
```

#### .describeExpectedError([errLike[, errMsgMatcher]]) or .describeExpectedError([errMsgMatcher])

```js
var checkError = require('check-error');

checkError.describeExpectedError(); // "an Error"
checkError.describeExpectedError('waffles'); // "an Error including 'waffles'"
checkError.describeExpectedError(/waffles/); // "an Error matching /waffles/"
checkError.describeExpectedError(TypeError); // "a TypeError"
checkError.describeExpectedError(TypeError, 'waffles'); // "a TypeError including 'waffles'"
checkError.describeExpectedError(TypeError, /waffles/); // "a TypeError matching /waffles/"
checkError.describeExpectedError(new Error('I like waffles')); // "[Error: I like waffles]"
```

#### .createCriteria([errLike[, errMsgMatcher]]) or .createCriteria([errMsgMatcher])

```js
var checkError = require('check-error');

var criteria = checkError.createCriteria(TypeError, 'waffles');
checkError.describeExpectedError(criteria); // "a TypeError including 'waffles'"
checkError.checkError(new TypeError('I like waffles'), criteria); // true
```

#### .compatibleMessage(err, errMatcher)

```js
var checkError = require('check-error');

var funcThatThrows = function() { throw new TypeError('I am a TypeError') };
var caughtErr;

try {
  funcThatThrows();
} catch(e) {
  caughtErr = e;
}

var sameInstance = caughtErr;

checkError.compatibleMessage(caughtErr, /TypeError$/); // true
checkError.compatibleMessage(caughtErr, 'I am a'); // true
checkError.compatibleMessage(caughtErr, /unicorn/); // false
checkError.compatibleMessage(caughtErr, 'I do not exist'); // false
```

#### .getConstructorName(errorLike)

```js
var checkError = require('check-error');

var funcThatThrows = function() { throw new TypeError('I am a TypeError') };
var caughtErr;

try {
  funcThatThrows();
} catch(e) {
  caughtErr = e;
}

var sameInstance = caughtErr;

checkError.getConstructorName(caughtErr) // 'TypeError'
```

#### .getMessage(err)

```js
var checkError = require('check-error');

var funcThatThrows = function() { throw new TypeError('I am a TypeError') };
var caughtErr;

try {
  funcThatThrows();
} catch(e) {
  caughtErr = e;
}

var sameInstance = caughtErr;

checkError.getMessage(caughtErr) // 'I am a TypeError'
```
