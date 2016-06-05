'use strict';
var assert = require('simple-assert');
var checkError = require('..');
describe('checkError', function () {
  it('compatibleInstance', function () {
    var errorInstance = new Error('I am an instance');
    var sameInstance = errorInstance;
    var otherInstance = new Error('I an another instance');
    var aNumber = 1337;
    assert(checkError.compatibleInstance(errorInstance, sameInstance) === true);
    assert(checkError.compatibleInstance(errorInstance, otherInstance) === false);
    assert(checkError.compatibleInstance(errorInstance, Error) === false);
    assert(checkError.compatibleInstance(errorInstance, aNumber) === false);
  });

  it('compatibleConstructor', function () {
    var errorInstance = new Error('I am an instance');
    var sameInstance = errorInstance;
    var otherInstance = new Error('I an another instance');
    var derivedInstance = new TypeError('I inherit from Error');
    var anObject = {};
    var aNumber = 1337;
    assert(checkError.compatibleConstructor(errorInstance, sameInstance) === true);
    assert(checkError.compatibleConstructor(errorInstance, otherInstance) === true);
    assert(checkError.compatibleConstructor(derivedInstance, errorInstance) === true);
    assert(checkError.compatibleConstructor(errorInstance, derivedInstance) === false);

    assert(checkError.compatibleConstructor(errorInstance, Error) === true);
    assert(checkError.compatibleConstructor(derivedInstance, TypeError) === true);
    assert(checkError.compatibleConstructor(errorInstance, TypeError) === false);

    assert(checkError.compatibleConstructor(errorInstance, anObject) === false);
    assert(checkError.compatibleConstructor(errorInstance, aNumber) === false);
  });

  it('compatibleMessage', function () {
    var errorInstance = new Error('I am an instance');
    var derivedInstance = new TypeError('I inherit from Error');
    var thrownMessage = 'Imagine I have been thrown';
    assert(checkError.compatibleMessage(errorInstance, /instance$/) === true);
    assert(checkError.compatibleMessage(derivedInstance, /Error$/) === true);
    assert(checkError.compatibleMessage(errorInstance, /unicorn$/) === false);
    assert(checkError.compatibleMessage(derivedInstance, /dinosaur$/) === false);

    assert(checkError.compatibleMessage(errorInstance, 'instance') === true);
    assert(checkError.compatibleMessage(derivedInstance, 'Error') === true);
    assert(checkError.compatibleMessage(errorInstance, 'unicorn') === false);
    assert(checkError.compatibleMessage(derivedInstance, 'dinosaur') === false);

    assert(checkError.compatibleMessage(thrownMessage, /thrown$/) === true);
    assert(checkError.compatibleMessage(thrownMessage, /^Imagine/) === true);
    assert(checkError.compatibleMessage(thrownMessage, /unicorn$/) === false);
    assert(checkError.compatibleMessage(thrownMessage, /dinosaur$/) === false);

    assert(checkError.compatibleMessage(thrownMessage, 'Imagine') === true);
    assert(checkError.compatibleMessage(thrownMessage, 'thrown') === true);
    assert(checkError.compatibleMessage(thrownMessage, 'unicorn') === false);
    assert(checkError.compatibleMessage(thrownMessage, 'dinosaur') === false);

    assert(checkError.compatibleMessage(thrownMessage, undefined) === false);
    assert(checkError.compatibleMessage(thrownMessage, null) === false);
  });

  it('constructorName', function () {
    var errorInstance = new Error('I am an instance');
    var derivedInstance = new TypeError('I inherit from Error');
    var thrownMessage = 'Imagine I have been thrown';
    assert(checkError.getConstructorName(errorInstance) === 'Error');
    assert(checkError.getConstructorName(derivedInstance) === 'TypeError');

    assert(checkError.getConstructorName(thrownMessage) === 'Imagine I have been thrown');

    assert(checkError.getConstructorName(Error) === 'Error');
    assert(checkError.getConstructorName(TypeError) === 'TypeError');

    assert(checkError.getConstructorName(null) === null);
    assert(checkError.getConstructorName(undefined) === undefined);

    // Asserting that `getFunctionName` behaves correctly
    function /*one*/correctName/*two*/() { // eslint-disable-line no-inline-comments, spaced-comment
      return 0;
    }

    function withoutComments() {
      return 1;
    }

    var anonymousFunc = function () { // eslint-disable-line func-style
      return 2;
    };

    // See chaijs/chai/issues/45: some poorly-constructed custom errors don't have useful names
    // on either their constructor or their constructor prototype, but instead
    // only set the name inside the constructor itself.
    var PoorlyConstructedError = function () { // eslint-disable-line func-style
      this.name = 'PoorlyConstructedError'; // eslint-disable-line no-invalid-this
    };
    PoorlyConstructedError.prototype = Object.create(Error.prototype);

    assert(checkError.getConstructorName(correctName) === 'correctName');
    assert(checkError.getConstructorName(withoutComments) === 'withoutComments');
    assert(checkError.getConstructorName(anonymousFunc) === '');
    assert(checkError.getConstructorName(PoorlyConstructedError) === 'PoorlyConstructedError');
  });

  it('getMessage', function () {
    var errorInstance = new Error('I am an instance');
    var derivedInstance = new TypeError('I inherit from Error');
    var thrownMessage = 'Imagine I have been thrown';
    var errorExpMsg = errorInstance.message;
    var derivedExpMsg = derivedInstance.message;
    assert(checkError.getMessage(errorInstance) === errorExpMsg);
    assert(checkError.getMessage(derivedInstance) === derivedExpMsg);

    assert(checkError.getMessage(thrownMessage) === 'Imagine I have been thrown');

    assert(checkError.getMessage(Error) === '');
    assert(checkError.getMessage(TypeError) === '');

    assert(checkError.getMessage(null) === '');
    assert(checkError.getMessage(undefined) === '');
  });
});
