var simpleAssert = {exports: {}};

/*!
 * assertion-error
 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Return a function that will copy properties from
 * one object to another excluding any originally
 * listed. Returned function will create a new `{}`.
 *
 * @param {String} excluded properties ...
 * @return {Function}
 */

function exclude () {
  var excludes = [].slice.call(arguments);

  function excludeProps (res, obj) {
    Object.keys(obj).forEach(function (key) {
      if (!~excludes.indexOf(key)) res[key] = obj[key];
    });
  }

  return function extendExclude () {
    var args = [].slice.call(arguments)
      , i = 0
      , res = {};

    for (; i < args.length; i++) {
      excludeProps(res, args[i]);
    }

    return res;
  };
}
/*!
 * Primary Exports
 */

var assertionError = AssertionError$1;

/**
 * ### AssertionError
 *
 * An extension of the JavaScript `Error` constructor for
 * assertion and validation scenarios.
 *
 * @param {String} message
 * @param {Object} properties to include (optional)
 * @param {callee} start stack function (optional)
 */

function AssertionError$1 (message, _props, ssf) {
  var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON')
    , props = extend(_props || {});

  // default values
  this.message = message || 'Unspecified AssertionError';
  this.showDiff = false;

  // copy from properties
  for (var key in props) {
    this[key] = props[key];
  }

  // capture stack trace
  ssf = ssf || arguments.callee;
  if (ssf && Error.captureStackTrace) {
    Error.captureStackTrace(this, ssf);
  }
}

/*!
 * Inherit from Error.prototype
 */

AssertionError$1.prototype = Object.create(Error.prototype);

/*!
 * Statically set name
 */

AssertionError$1.prototype.name = 'AssertionError';

/*!
 * Ensure correct constructor
 */

AssertionError$1.prototype.constructor = AssertionError$1;

/**
 * Allow errors to be converted to JSON for static transfer.
 *
 * @param {Boolean} include stack (default: `true`)
 * @return {Object} object that can be `JSON.stringify`
 */

AssertionError$1.prototype.toJSON = function (stack) {
  var extend = exclude('constructor', 'toJSON', 'stack')
    , props = extend({ name: this.name }, this);

  // include stack if exists and not turned off
  if (false !== stack && this.stack) {
    props.stack = this.stack;
  }

  return props;
};

/*!
 * simple-assert
 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var AssertionError = assertionError;

/*!
 * Primary export
 */

var exports = simpleAssert.exports = assert;

/*!
 * Expose AssertionError constructor
 */

exports.AssertionError = AssertionError;

/**
 * ### assert (expr[, msg])
 *
 * Perform a truthy assertion.
 *
 * ```js
 * var assert = require('simple-assert');
 * assert(true, 'true is truthy');
 * assert(1, '1 is truthy');
 * assert('string', 'string is truthy');
 * ```
 *
 * @param {Mixed} expression to test for truthiness
 * @param {String} message on failure
 * @throws AssertionError
 */

function assert (expr, msg, ssf) {
  if (!expr) {
    throw new AssertionError(msg || 'Assertion Failed', null, ssf || arguments.callee);
  }
}

/**
 * ### assert.not (expr[, msg])
 *
 * Perform a falsey assertion.
 *
 * ```js
 * db.get(123, function (err, doc) {
 *   assert.not(err, 'db.get returned error');
 *   // ...
 * });
 * ```
 *
 * @param {Mixed} express to test for falsiness
 * @param {String} messag eon failure
 * @throws AssertionError
 */

exports.not = function (expr, msg) {
  assert(!expr, msg, arguments.callee);
};

/**
 * ### assert.fail ([msg])
 *
 * Force an `AssertionError` to be thrown.
 *
 * ```js
 * switch (res.statusCode) {
 *   case 200:
 *     // ..
 *     break;
 *   case 404:
 *     // ..
 *     break;
 *   default:
 *     assert.fail('Unknown response statusCode');
 * }
 * ```
 *
 * @param {String} failure message
 * @throws AssertionError
 */

exports.fail = function (msg) {
  assert(false, msg, arguments.callee);
};

var assert$1 = simpleAssert.exports;

/* !
 * Chai - getFuncName utility
 * Copyright(c) 2012-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .getFuncName(constructorFn)
 *
 * Returns the name of a function.
 * When a non-function instance is passed, returns `null`.
 * This also includes a polyfill function if `aFunc.name` is not defined.
 *
 * @name getFuncName
 * @param {Function} funct
 * @namespace Utils
 * @api public
 */

var toString = Function.prototype.toString;
var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\s\(\/]+)/;
function getFuncName(aFunc) {
  if (typeof aFunc !== 'function') {
    return null;
  }

  var name = '';
  if (typeof Function.prototype.name === 'undefined' && typeof aFunc.name === 'undefined') {
    // Here we run a polyfill if Function does not support the `name` property and if aFunc.name is not defined
    var match = toString.call(aFunc).match(functionNameMatch);
    if (match) {
      name = match[1];
    }
  } else {
    // If we've got a `name` property we just use it
    name = aFunc.name;
  }

  return name;
}

var getFuncName_1 = getFuncName;

/**
 * ### .compatibleInstance(thrown, errorLike)
 *
 * Checks if two instances are compatible (strict equal).
 * Returns false if errorLike is not an instance of Error, because instances
 * can only be compatible if they're both error instances.
 *
 * @name compatibleInstance
 * @param {Error} thrown error
 * @param {Error|ErrorConstructor} errorLike object to compare against
 * @namespace Utils
 * @api public
 */

function compatibleInstance(thrown, errorLike) {
  return errorLike instanceof Error && thrown === errorLike;
}

/**
 * ### .compatibleConstructor(thrown, errorLike)
 *
 * Checks if two constructors are compatible.
 * This function can receive either an error constructor or
 * an error instance as the `errorLike` argument.
 * Constructors are compatible if they're the same or if one is
 * an instance of another.
 *
 * @name compatibleConstructor
 * @param {Error} thrown error
 * @param {Error|ErrorConstructor} errorLike object to compare against
 * @namespace Utils
 * @api public
 */

function compatibleConstructor(thrown, errorLike) {
  if (errorLike instanceof Error) {
    // If `errorLike` is an instance of any error we compare their constructors
    return thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor;
  } else if (errorLike.prototype instanceof Error || errorLike === Error) {
    // If `errorLike` is a constructor that inherits from Error, we compare `thrown` to `errorLike` directly
    return thrown.constructor === errorLike || thrown instanceof errorLike;
  }

  return false;
}

/**
 * ### .compatibleMessage(thrown, errMatcher)
 *
 * Checks if an error's message is compatible with a matcher (String or RegExp).
 * If the message contains the String or passes the RegExp test,
 * it is considered compatible.
 *
 * @name compatibleMessage
 * @param {Error} thrown error
 * @param {String|RegExp} errMatcher to look for into the message
 * @namespace Utils
 * @api public
 */

function compatibleMessage(thrown, errMatcher) {
  const comparisonString = typeof thrown === 'string' ? thrown : thrown.message;
  if (errMatcher instanceof RegExp) {
    return errMatcher.test(comparisonString);
  } else if (typeof errMatcher === 'string') {
    return comparisonString.indexOf(errMatcher) !== -1; // eslint-disable-line no-magic-numbers
  }

  return false;
}

/**
 * ### .getConstructorName(errorLike)
 *
 * Gets the constructor name for an Error instance or constructor itself.
 *
 * @name getConstructorName
 * @param {Error|ErrorConstructor} errorLike
 * @namespace Utils
 * @api public
 */

function getConstructorName(errorLike) {
  let constructorName = errorLike;
  if (errorLike instanceof Error) {
    constructorName = getFuncName_1(errorLike.constructor);
  } else if (typeof errorLike === 'function') {
    // If `err` is not an instance of Error it is an error constructor itself or another function.
    // If we've got a common function we get its name, otherwise we may need to create a new instance
    // of the error just in case it's a poorly-constructed error. Please see chaijs/chai/issues/45 to know more.
    constructorName = getFuncName_1(errorLike);
    if (constructorName === '') {
      const newConstructorName = getFuncName_1(new errorLike()); // eslint-disable-line new-cap
      constructorName = newConstructorName || constructorName;
    }
  }

  return constructorName;
}

/**
 * ### .getMessage(errorLike)
 *
 * Gets the error message from an error.
 * If `err` is a String itself, we return it.
 * If the error has no message, we return an empty string.
 *
 * @name getMessage
 * @param {Error|String} errorLike
 * @namespace Utils
 * @api public
 */

function getMessage(errorLike) {
  let msg = '';
  if (errorLike && errorLike.message) {
    msg = errorLike.message;
  } else if (typeof errorLike === 'string') {
    msg = errorLike;
  }

  return msg;
}

describe('checkError', function () {
  it('compatibleInstance', function () {
    const errorInstance = new Error('I am an instance');
    const sameInstance = errorInstance;
    const otherInstance = new Error('I an another instance');
    const aNumber = 1337;
    assert$1(compatibleInstance(errorInstance, sameInstance) === true);
    assert$1(compatibleInstance(errorInstance, otherInstance) === false);
    assert$1(compatibleInstance(errorInstance, Error) === false);
    assert$1(compatibleInstance(errorInstance, aNumber) === false);
  });

  it('compatibleConstructor', function () {
    const errorInstance = new Error('I am an instance');
    const sameInstance = errorInstance;
    const otherInstance = new Error('I an another instance');
    const derivedInstance = new TypeError('I inherit from Error');
    const anObject = {};
    const aNumber = 1337;
    assert$1(compatibleConstructor(errorInstance, sameInstance) === true);
    assert$1(compatibleConstructor(errorInstance, otherInstance) === true);
    assert$1(compatibleConstructor(derivedInstance, errorInstance) === true);
    assert$1(compatibleConstructor(errorInstance, derivedInstance) === false);

    assert$1(compatibleConstructor(errorInstance, Error) === true);
    assert$1(compatibleConstructor(derivedInstance, TypeError) === true);
    assert$1(compatibleConstructor(errorInstance, TypeError) === false);

    assert$1(compatibleConstructor(errorInstance, anObject) === false);
    assert$1(compatibleConstructor(errorInstance, aNumber) === false);
  });

  it('compatibleMessage', function () {
    const errorInstance = new Error('I am an instance');
    const derivedInstance = new TypeError('I inherit from Error');
    const thrownMessage = 'Imagine I have been thrown';
    assert$1(compatibleMessage(errorInstance, /instance$/) === true);
    assert$1(compatibleMessage(derivedInstance, /Error$/) === true);
    assert$1(compatibleMessage(errorInstance, /unicorn$/) === false);
    assert$1(compatibleMessage(derivedInstance, /dinosaur$/) === false);

    assert$1(compatibleMessage(errorInstance, 'instance') === true);
    assert$1(compatibleMessage(derivedInstance, 'Error') === true);
    assert$1(compatibleMessage(errorInstance, 'unicorn') === false);
    assert$1(compatibleMessage(derivedInstance, 'dinosaur') === false);

    assert$1(compatibleMessage(thrownMessage, /thrown$/) === true);
    assert$1(compatibleMessage(thrownMessage, /^Imagine/) === true);
    assert$1(compatibleMessage(thrownMessage, /unicorn$/) === false);
    assert$1(compatibleMessage(thrownMessage, /dinosaur$/) === false);

    assert$1(compatibleMessage(thrownMessage, 'Imagine') === true);
    assert$1(compatibleMessage(thrownMessage, 'thrown') === true);
    assert$1(compatibleMessage(thrownMessage, 'unicorn') === false);
    assert$1(compatibleMessage(thrownMessage, 'dinosaur') === false);

    assert$1(compatibleMessage(thrownMessage, undefined) === false);
    assert$1(compatibleMessage(thrownMessage, null) === false);
  });

  it('constructorName', function () {
    const errorInstance = new Error('I am an instance');
    const derivedInstance = new TypeError('I inherit from Error');
    const thrownMessage = 'Imagine I have been thrown';
    assert$1(getConstructorName(errorInstance) === 'Error');
    assert$1(getConstructorName(derivedInstance) === 'TypeError');

    assert$1(getConstructorName(thrownMessage) === 'Imagine I have been thrown');

    assert$1(getConstructorName(Error) === 'Error');
    assert$1(getConstructorName(TypeError) === 'TypeError');

    assert$1(getConstructorName(null) === null);
    assert$1(getConstructorName(undefined) === undefined);

    // Asserting that `getFunctionName` behaves correctly
    function /*one*/correctName/*two*/() { // eslint-disable-line no-inline-comments, spaced-comment
      return 0;
    }

    function withoutComments() {
      return 1;
    }

    const anonymousFunc = (function () {
      return function () { // eslint-disable-line func-style
        return 2;
      };
    }());

    // See chaijs/chai/issues/45: some poorly-constructed custom errors don't have useful names
    // on either their constructor or their constructor prototype, but instead
    // only set the name inside the constructor itself.
    const PoorlyConstructedError = function () { // eslint-disable-line func-style
      this.name = 'PoorlyConstructedError'; // eslint-disable-line no-invalid-this
    };
    PoorlyConstructedError.prototype = Object.create(Error.prototype);

    assert$1(getConstructorName(correctName) === 'correctName');
    assert$1(getConstructorName(withoutComments) === 'withoutComments');
    assert$1(getConstructorName(anonymousFunc) === '');
    assert$1(getConstructorName(PoorlyConstructedError) === 'PoorlyConstructedError');
  });

  it('getMessage', function () {
    const errorInstance = new Error('I am an instance');
    const derivedInstance = new TypeError('I inherit from Error');
    const thrownMessage = 'Imagine I have been thrown';
    const errorExpMsg = errorInstance.message;
    const derivedExpMsg = derivedInstance.message;
    assert$1(getMessage(errorInstance) === errorExpMsg);
    assert$1(getMessage(derivedInstance) === derivedExpMsg);

    assert$1(getMessage(thrownMessage) === 'Imagine I have been thrown');

    assert$1(getMessage(Error) === '');
    assert$1(getMessage(TypeError) === '');

    assert$1(getMessage(null) === '');
    assert$1(getMessage(undefined) === '');
  });
});
