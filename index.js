'use strict';

/* !
 * Chai - checkError utility
 * Copyright(c) 2012-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var getFunctionName = require('get-func-name');

var VOWELS = [ 'a', 'e', 'i', 'o', 'u' ];
/**
 * ### .checkError
 *
 * Checks that an error conforms to a given set of criteria and/or retrieves information about it.
 *
 * @api public
 */

/**
 * ### .getMessage(errorLike)
 *
 * Gets the error message from an error.
 * If the error has no message, we return an empty string.
 *
 * @name getMessage
 * @param {Error|String} errorLike
 * @namespace Utils
 * @api public
 */

function getMessage(errorLike) {
  if (errorLike && errorLike.message) {
    return errorLike.message;
  }

  return '';
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
  var comparisonString = getMessage(thrown);
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
  var constructorName = errorLike;
  if (errorLike instanceof Error) {
    constructorName = getFunctionName(errorLike.constructor);
  } else if (typeof errorLike === 'function') {
    // If `err` is not an instance of Error it is an error constructor itself or another function.
    // If we've got a common function we get its name, otherwise we may need to create a new instance
    // of the error just in case it's a poorly-constructed error. Please see chaijs/chai/issues/45 to know more.
    constructorName = getFunctionName(errorLike);
    if (constructorName === '') {
      var newConstructorName = getFunctionName(new errorLike()); // eslint-disable-line new-cap
      constructorName = newConstructorName || constructorName;
    }
  }

  return constructorName;
}

/**
 * ### .describeExpectedError(criteria)
 *
 * Return a string describing what kind of `Error` instance is expected based on
 * `criteria` (which is an object returned by `.createCriteria`).
 *
 * @param {Object} criteria
 * @returns String
 */
function describeExpectedError(criteria) {
  if (criteria.errLikeType === 'error') {
    // Mimic `util.inspect`.
    return '[' + criteria.errLike.toString() + ']';
  }

  var desc = '';
  var constructor = getConstructorName(criteria.errLike);
  var first = constructor.charAt(0).toLowerCase();
  var article = VOWELS.indexOf(first) > -1 ? 'an ' : 'a '; // eslint-disable-line no-magic-numbers
  desc += article + constructor;

  if (criteria.errMsgMatcherType === 'string') {
    desc += ' including \'' + criteria.errMsgMatcher + '\'';
  } else if (criteria.errMsgMatcherType === 'regexp') {
    desc += ' matching ' + criteria.errMsgMatcher;
  }

  return desc;
}

/**
 * ### .checkError(errObj, criteria)
 *
 * Validate that `errObj` is an `Error` instance that matches `criteria` (which
 * is an object returned by `.createCriteria`).
 *
 * @param {Error} errObj
 * @param {Object} criteria
 * @returns Boolean
 */
function checkError(errObj, criteria) {
  if (criteria.errLikeType === 'error' && errObj !== criteria.errLike) {
    return false;
  }

  if (criteria.errLikeType === 'error-constructor' &&
      !(errObj instanceof criteria.errLike)) {
    return false;
  }

  if ((criteria.errMsgMatcherType === 'string' ||
      criteria.errMsgMatcherType === 'regexp') &&
      !compatibleMessage(errObj, criteria.errMsgMatcher)) {
    return false;
  }

  return true;
}

function getType(val) {
  var type = typeof val;
  if (type === 'object') {
    if (val === null) {
      return 'null';
    }
    if (val instanceof Error) {
      return 'error';
    }
    if (val instanceof RegExp) {
      return 'regexp';
    }
  } else if (type === 'function') {
    if (val === Error || val.prototype instanceof Error) {
      return 'error-constructor';
    }
  }
  return type;
}

/**
 * ### .createCriteria([errLike[, errMsgMatcher]])
 *
 * Return a criteria object which can be passed to `.checkError` and
 * `.describeExpectedError`. Passing this criteria object to `.checkError` along
 * with an `errObj` will validate the following:
 *
 * If `errLike` is an `Error` constructor, then validate that `errObj` is an
 * instance of `errLike`.
 *
 * If `errLike` is an `Error` instance, then validate that `errObj` is strictly
 * (`===`) equal to `errLike`.
 *
 * If `errMsgMatcher` is a string or regex, then validate that `errObj`'s
 * message includes or matches `errMsgMatcher`.
 *
 * This function allows `errLike` to be omitted and `errMsgMatcher` to be
 * passed in as the first argument. In other words, this function signature is
 * also supported: `.createCriteria([errMsgMatcher])`.
 *
 * If `errLike` is omitted or is explicitly `null` or `undefined`, then it
 * defaults to the built-in `Error` constructor.
 *
 * @param {Error|ErrorConstructor} [errLike=Error]
 * @param {String|RegExp} [errMsgMatcher]
 * @returns Object
 */
function createCriteria(errLike, errMsgMatcher) {
  var errLikeType = getType(errLike);
  var errMsgMatcherType = getType(errMsgMatcher);
  // Handle `errLike` being omitted and `errMsgMatcher` being passed as the
  // second argument.
  if (errLikeType === 'string' || errLikeType === 'regexp') {
    if (errMsgMatcherType !== 'undefined' && errMsgMatcherType !== 'null') {
      throw TypeError('errMsgMatcher must be null or undefined when errLike' +
                       ' is a string or regular expression');
    }
    errMsgMatcher = errLike;
    errMsgMatcherType = errLikeType;
    errLikeType = 'null';
  }

  if (errLikeType === 'undefined' || errLikeType === 'null') {
    errLike = Error;
    errLikeType = getType(errLike);
  }

  if (errLikeType !== 'error' && errLikeType !== 'error-constructor') {
    throw TypeError('errLike must be an Error constructor or instance');
  }

  if (errMsgMatcherType !== 'undefined' && errMsgMatcherType !== 'null' &&
      errMsgMatcherType !== 'string' && errMsgMatcherType !== 'regexp') {
    throw TypeError('errMsgMatcher must be a string or regular expression');
  }

  if (errLikeType === 'error' && errMsgMatcherType !== 'undefined' &&
      errMsgMatcherType !== 'null') {
    throw TypeError('errMsgMatcher must be null or undefined when errLike is' +
                    ' an Error instance');
  }

  return {
    errLike: errLike,
    errLikeType: errLikeType,
    errMsgMatcher: errMsgMatcher,
    errMsgMatcherType: errMsgMatcherType,
  };
}


module.exports = {
  checkError: checkError,
  compatibleMessage: compatibleMessage,
  createCriteria: createCriteria,
  describeExpectedError: describeExpectedError,
  getMessage: getMessage,
  getConstructorName: getConstructorName,
};
