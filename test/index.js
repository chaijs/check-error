'use strict';
var assert = require('simple-assert');
var checkError = require('..');
function assertError(testFn, errMsg) {
  var errObj = null;
  try {
    testFn();
  } catch (_errObj) {
    errObj = _errObj;
  }
  assert(errObj && errObj.message === errMsg, 'Expected TypeError: ' + errMsg + ' but got ' + errObj);
}
describe('checkError', function () {
  describe('checkError', function () {
    var errObj = new Error('I like waffles');
    var subErrObj = new TypeError('I like waffles');
    var notErrObj = { message: 'I like waffles' };
    it('returns true when passed a matching Error constructor and string', function () {
      assert(checkError.checkError(errObj, Error, 'waffles') === true);
    });
    it('returns false when passed a non-matching Error constructor and string', function () {
      assert(checkError.checkError(errObj, ReferenceError, 'pancakes') === false);
    });
    it('returns false when passed a matching Error constructor and non-matching string', function () {
      assert(checkError.checkError(errObj, Error, 'pancakes') === false);
    });
    it('returns false when passed a non-matching Error constructor and matching string', function () {
      assert(checkError.checkError(errObj, ReferenceError, 'waffles') === false);
    });

    it('returns true when passed a matching Error constructor and regexp', function () {
      assert(checkError.checkError(errObj, Error, /waffles/) === true);
    });
    it('returns false when passed a non-matching Error constructor and regexp', function () {
      assert(checkError.checkError(errObj, ReferenceError, /pancakes/) === false);
    });
    it('returns false when passed a matching Error constructor and non-matching regexp', function () {
      assert(checkError.checkError(errObj, Error, /pancakes/) === false);
    });
    it('returns false when passed a non-matching Error constructor and matching regexp', function () {
      assert(checkError.checkError(errObj, ReferenceError, /waffles/) === false);
    });

    it('returns true when passed a matching Error constructor alone', function () {
      assert(checkError.checkError(errObj, Error) === true);
    });
    it('returns false when passed a non-matching Error constructor alone', function () {
      assert(checkError.checkError(errObj, ReferenceError) === false);
    });

    it('returns true when passed matching args and the target is a subclassed Error instance', function () {
      assert(checkError.checkError(subErrObj, Error, 'waffles') === true);
    });
    it('returns false when passed non-matching args and the target is a subclassed Error instance', function () {
      assert(checkError.checkError(subErrObj, ReferenceError, /pancakes/) === false);
    });

    it('returns true when passed a matching subclassed Error constructor', function () {
      assert(checkError.checkError(subErrObj, TypeError) === true);
    });
    it('returns false when passed a non-matching subclassed Error constructor', function () {
      assert(checkError.checkError(subErrObj, ReferenceError) === false);
    });

    it('returns true when passed a matching Error instance', function () {
      assert(checkError.checkError(errObj, errObj) === true);
    });
    it('returns false when passed a non-matching Error instance', function () {
      assert(checkError.checkError(errObj, subErrObj) === false);
    });

    it('returns true when passed a matching subclassed Error instance', function () {
      assert(checkError.checkError(subErrObj, subErrObj) === true);
    });
    it('returns false when passed a non-matching subclassed Error instance', function () {
      assert(checkError.checkError(subErrObj, new ReferenceError('I like waffles')) === false);
    });

    it('defaults to the Error constructor when no args passed and returns true if it matches', function () {
      assert(checkError.checkError(errObj) === true);
    });
    it('defaults to the Error constructor when no args passed and returns false if no match', function () {
      assert(checkError.checkError(notErrObj) === false);
    });

    it('defaults to the Error constructor when passed a string alone and returns true if it matches', function () {
      assert(checkError.checkError(errObj, 'waffles') === true);
    });
    it('defaults to the Error constructor when passed a string alone and returns false if no match', function () {
      assert(checkError.checkError(notErrObj, 'waffles') === false);
    });

    it('defaults to the Error constructor when passed a regexp alone and returns true if it matches', function () {
      assert(checkError.checkError(errObj, /waffles/) === true);
    });
    it('defaults to the Error constructor when passed a regexp alone and returns false if no match', function () {
      assert(checkError.checkError(notErrObj, /waffles/) === false);
    });

    it('returns true when passed a matching criteria object', function () {
      var criteria = checkError.createCriteria(Error, 'waffles');
      assert(checkError.checkError(errObj, criteria) === true);
    });
    it('returns false when passed a non-matching criteria object', function () {
      var criteria = checkError.createCriteria(ReferenceError, 'pancakes');
      assert(checkError.checkError(errObj, criteria) === false);
    });
  });

  it('compatibleMessage', function () {
    var errorInstance = new Error('I am an instance');
    var derivedInstance = new TypeError('I inherit from Error');
    assert(checkError.compatibleMessage(errorInstance, /instance$/) === true);
    assert(checkError.compatibleMessage(derivedInstance, /Error$/) === true);
    assert(checkError.compatibleMessage(errorInstance, /unicorn$/) === false);
    assert(checkError.compatibleMessage(derivedInstance, /dinosaur$/) === false);

    assert(checkError.compatibleMessage(errorInstance, 'instance') === true);
    assert(checkError.compatibleMessage(derivedInstance, 'Error') === true);
    assert(checkError.compatibleMessage(errorInstance, 'unicorn') === false);
    assert(checkError.compatibleMessage(derivedInstance, 'dinosaur') === false);
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

    var anonymousFunc = (function () {
      return function () { // eslint-disable-line func-style
        return 2;
      };
    }());

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

  describe('createCriteria', function () {
    var errObj = new Error('I like waffles');
    var subErrObj = new TypeError('I like waffles');
    var notErrObj = { message: 'I like waffles' };
    it('returns criteria object when 1st arg is an Error constructor and 2nd arg is a string', function () {
      var criteria = checkError.createCriteria(Error, 'waffles');
      assert(checkError.isCriteria(criteria) === true);
      assert(criteria.errLike === Error);
      assert(criteria.errLikeType === 'error-constructor');
      assert(criteria.errMsgMatcher === 'waffles');
      assert(criteria.errMsgMatcherType === 'string');
    });
    it('returns criteria object when 1st arg is an Error constructor and 2nd arg is a regexp', function () {
      var errMsgMatcher = /waffles/;
      var criteria = checkError.createCriteria(Error, errMsgMatcher);
      assert(checkError.isCriteria(criteria) === true);
      assert(criteria.errLike === Error);
      assert(criteria.errLikeType === 'error-constructor');
      assert(criteria.errMsgMatcher === errMsgMatcher);
      assert(criteria.errMsgMatcherType === 'regexp');
    });
    it('returns criteria object when only arg is an Error constructor', function () {
      var criteria = checkError.createCriteria(Error);
      assert(checkError.isCriteria(criteria) === true);
      assert(criteria.errLike === Error);
      assert(criteria.errLikeType === 'error-constructor');
      assert(criteria.errMsgMatcher === undefined);
      assert(criteria.errMsgMatcherType === 'undefined');
    });
    it('returns criteria object when only arg is a subclassed Error constructor', function () {
      var criteria = checkError.createCriteria(TypeError);
      assert(checkError.isCriteria(criteria) === true);
      assert(criteria.errLike === TypeError);
      assert(criteria.errLikeType === 'error-constructor');
      assert(criteria.errMsgMatcher === undefined);
      assert(criteria.errMsgMatcherType === 'undefined');
    });
    it('returns criteria object when only arg is an Error instance', function () {
      var criteria = checkError.createCriteria(errObj);
      assert(checkError.isCriteria(criteria) === true);
      assert(criteria.errLike === errObj);
      assert(criteria.errLikeType === 'error');
      assert(criteria.errMsgMatcher === undefined);
      assert(criteria.errMsgMatcherType === 'undefined');
    });
    it('returns criteria object when only arg is a subclassed Error instance', function () {
      var criteria = checkError.createCriteria(subErrObj);
      assert(checkError.isCriteria(criteria) === true);
      assert(criteria.errLike === subErrObj);
      assert(criteria.errLikeType === 'error');
      assert(criteria.errMsgMatcher === undefined);
      assert(criteria.errMsgMatcherType === 'undefined');
    });
    it('defaults to the Error constructor when no args and returns a criteria object', function () {
      var criteria = checkError.createCriteria();
      assert(checkError.isCriteria(criteria) === true);
      assert(criteria.errLike === Error);
      assert(criteria.errLikeType === 'error-constructor');
      assert(criteria.errMsgMatcher === undefined);
      assert(criteria.errMsgMatcherType === 'undefined');
    });
    it('defaults to the Error constructor when only arg is a string and returns a criteria object', function () {
      var criteria = checkError.createCriteria('waffles');
      assert(checkError.isCriteria(criteria) === true);
      assert(criteria.errLike === Error);
      assert(criteria.errLikeType === 'error-constructor');
      assert(criteria.errMsgMatcher === 'waffles');
      assert(criteria.errMsgMatcherType === 'string');
    });
    it('defaults to the Error constructor when only arg is a regexp and returns a criteria object', function () {
      var errMsgMatcher = /waffles/;
      var criteria = checkError.createCriteria(errMsgMatcher);
      assert(checkError.isCriteria(criteria) === true);
      assert(criteria.errLike === Error);
      assert(criteria.errLikeType === 'error-constructor');
      assert(criteria.errMsgMatcher === errMsgMatcher);
      assert(criteria.errMsgMatcherType === 'regexp');
    });
    it('returns same criteria object when only arg is a criteria object', function () {
      var criteria1 = checkError.createCriteria(Error, 'waffles');
      var criteria2 = checkError.createCriteria(criteria1);
      assert(criteria1 === criteria2);
    });
    it('throws when 1st arg is a string and 2rd arg is defined', function () {
      assertError(function () {
        checkError.createCriteria('waffles', 'waffles');
      }, 'errMsgMatcher must be null or undefined when errLike is a string or regular expression');
    });
    it('throws when 1st arg isn\'t a valid type', function () {
      assertError(function () {
        checkError.createCriteria(notErrObj);
      }, 'errLike must be an Error constructor or instance, string, regular expression, or criteria object');
    });
    it('throws when 2nd arg is defined but not a string or regexp', function () {
      assertError(function () {
        checkError.createCriteria(Error, notErrObj);
      }, 'errMsgMatcher must be a string or regular expression');
    });
    it('throws when 1st arg is an Error instance and 2nd arg is defined', function () {
      assertError(function () {
        checkError.createCriteria(errObj, 'waffles');
      }, 'errMsgMatcher must be null or undefined when errLike is an Error instance');
    });
    it('throws when 1st arg is a criteria object and 2nd arg is defined', function () {
      var criteria = checkError.createCriteria(Error, 'waffles');
      assertError(function () {
        checkError.createCriteria(criteria, 'waffles');
      }, 'errMsgMatcher must be null or undefined when errLike is a criteria object');
    });
  });

  describe('describeExpectedError', function () {
    it('returns description when passed the Error constructor and a string', function () {
      assert(checkError.describeExpectedError(Error, 'waffles') === 'an Error including \'waffles\'');
    });
    it('returns description when passed the Error constructor and a regexp', function () {
      assert(checkError.describeExpectedError(Error, /waffles/) === 'an Error matching /waffles/');
    });
    it('returns description when passed the Error constructor alone', function () {
      assert(checkError.describeExpectedError(Error) === 'an Error');
    });
    it('returns description when passed a subclassed Error constructor', function () {
      assert(checkError.describeExpectedError(TypeError, 'waffles') === 'a TypeError including \'waffles\'');
    });
    it('returns .toString result in brackets when passed an Error instance', function () {
      assert(checkError.describeExpectedError(new Error('waffles')) === '[Error: waffles]');
    });
    it('returns .toString result in brackets when passed a subclassed Error instance', function () {
      assert(checkError.describeExpectedError(new TypeError('waffles')) === '[TypeError: waffles]');
    });
    it('defaults to the Error constructor and returns description when no args passed', function () {
      assert(checkError.describeExpectedError() === 'an Error');
    });
    it('defaults to the Error constructor and returns description when passed a string alone', function () {
      assert(checkError.describeExpectedError('waffles') === 'an Error including \'waffles\'');
    });
    it('defaults to the Error constructor and returns description when passed a regexp alone', function () {
      assert(checkError.describeExpectedError(/waffles/) === 'an Error matching /waffles/');
    });
    it('returns description when passed a criteria object', function () {
      var criteria = checkError.createCriteria(Error, 'waffles');
      assert(checkError.describeExpectedError(criteria) === 'an Error including \'waffles\'');
    });
  });

  it('getMessage', function () {
    var errorInstance = new Error('I am an instance');
    var derivedInstance = new TypeError('I inherit from Error');
    var errorExpMsg = errorInstance.message;
    var derivedExpMsg = derivedInstance.message;
    assert(checkError.getMessage(errorInstance) === errorExpMsg);
    assert(checkError.getMessage(derivedInstance) === derivedExpMsg);

    assert(checkError.getMessage(Error) === '');
    assert(checkError.getMessage(TypeError) === '');

    assert(checkError.getMessage(null) === '');
    assert(checkError.getMessage(undefined) === '');
  });

  describe('isCriteria', function () {
    it('returns true when passed a criteria object', function () {
      var criteria = checkError.createCriteria(TypeError, 'waffles');
      assert(checkError.isCriteria(criteria) === true);
    });
    it('returns false when passed something other than a criteria object', function () {
      assert(checkError.isCriteria({}) === false);
    });
  });
});
