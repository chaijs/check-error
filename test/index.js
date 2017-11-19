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
    /***************/
    it('returns true when criteria is a matching Error constructor and string', function () {
      var criteria = checkError.createCriteria(Error, 'waffles');
      assert(checkError.checkError(errObj, criteria) === true);
    });
    it('returns false when criteria is a non-matching Error constructor and string', function () {
      var criteria = checkError.createCriteria(ReferenceError, 'pancakes');
      assert(checkError.checkError(errObj, criteria) === false);
    });
    it('returns false when criteria is a matching Error constructor and non-matching string', function () {
      var criteria = checkError.createCriteria(Error, 'pancakes');
      assert(checkError.checkError(errObj, criteria) === false);
    });
    it('returns false when criteria is a non-matching Error constructor and matching string', function () {
      var criteria = checkError.createCriteria(ReferenceError, 'waffles');
      assert(checkError.checkError(errObj, criteria) === false);
    });
    /***************/
    it('returns true when criteria is a matching Error constructor and regexp', function () {
      var criteria = checkError.createCriteria(Error, /waffles/);
      assert(checkError.checkError(errObj, criteria) === true);
    });
    it('returns false when criteria is a non-matching Error constructor and regexp', function () {
      var criteria = checkError.createCriteria(ReferenceError, /pancakes/);
      assert(checkError.checkError(errObj, criteria) === false);
    });
    it('returns false when criteria is a matching Error constructor and non-matching regexp', function () {
      var criteria = checkError.createCriteria(Error, /pancakes/);
      assert(checkError.checkError(errObj, criteria) === false);
    });
    it('returns false when criteria is a non-matching Error constructor and matching regexp', function () {
      var criteria = checkError.createCriteria(ReferenceError, /waffles/);
      assert(checkError.checkError(errObj, criteria) === false);
    });
    /***************/
    it('returns true when criteria is a matching Error constructor alone', function () {
      var criteria = checkError.createCriteria(Error);
      assert(checkError.checkError(errObj, criteria) === true);
    });
    it('returns false when criteria is a non-matching Error constructor alone', function () {
      var criteria = checkError.createCriteria(ReferenceError);
      assert(checkError.checkError(errObj, criteria) === false);
    });
    /***************/
    it('returns true when criteria is matching and the target is a subclassed Error instance', function () {
      var criteria = checkError.createCriteria(Error, 'waffles');
      assert(checkError.checkError(subErrObj, criteria) === true);
    });
    it('returns false when criteria is non-matching and the target is a subclassed Error instance', function () {
      var criteria = checkError.createCriteria(ReferenceError, /pancakes/);
      assert(checkError.checkError(subErrObj, criteria) === false);
    });
    /***************/
    it('returns true when criteria is a matching subclassed Error constructor', function () {
      var criteria = checkError.createCriteria(TypeError);
      assert(checkError.checkError(subErrObj, criteria) === true);
    });
    it('returns false when criteria is a non-matching subclassed Error constructor', function () {
      var criteria = checkError.createCriteria(ReferenceError);
      assert(checkError.checkError(subErrObj, criteria) === false);
    });
    /***************/
    it('returns true when criteria is a matching Error instance', function () {
      var criteria = checkError.createCriteria(errObj);
      assert(checkError.checkError(errObj, criteria) === true);
    });
    it('returns false when criteria is a non-matching Error instance', function () {
      var criteria = checkError.createCriteria(subErrObj);
      assert(checkError.checkError(errObj, criteria) === false);
    });
    /***************/
    it('returns true when criteria is a matching subclassed Error instance', function () {
      var criteria = checkError.createCriteria(subErrObj);
      assert(checkError.checkError(subErrObj, criteria) === true);
    });
    it('returns false when criteria is a non-matching subclassed Error instance', function () {
      var criteria = checkError.createCriteria(new ReferenceError('I like waffles'));
      assert(checkError.checkError(subErrObj, criteria) === false);
    });
    /***************/
    it('defaults to the Error constructor when criteria is empty and returns true if it matches', function () {
      var criteria = checkError.createCriteria();
      assert(checkError.checkError(errObj, criteria) === true);
    });
    it('defaults to the Error constructor when criteria is empty and returns false if no match', function () {
      var criteria = checkError.createCriteria();
      assert(checkError.checkError(notErrObj, criteria) === false);
    });
    /***************/
    it('defaults to the Error constructor when criteria is a string alone and returns true if it matches', function () {
      var criteria = checkError.createCriteria('waffles');
      assert(checkError.checkError(errObj, criteria) === true);
    });
    it('defaults to the Error constructor when criteria is a string alone and returns false if no match', function () {
      var criteria = checkError.createCriteria('waffles');
      assert(checkError.checkError(notErrObj, criteria) === false);
    });
    /***************/
    it('defaults to the Error constructor when criteria is a regexp alone and returns true if it matches', function () {
      var criteria = checkError.createCriteria(/waffles/);
      assert(checkError.checkError(errObj, criteria) === true);
    });
    it('defaults to the Error constructor when criteria is a regexp alone and returns false if no match', function () {
      var criteria = checkError.createCriteria(/waffles/);
      assert(checkError.checkError(notErrObj, criteria) === false);
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
      assert(criteria.errLike === Error);
      assert(criteria.errLikeType === 'error-constructor');
      assert(criteria.errMsgMatcher === 'waffles');
      assert(criteria.errMsgMatcherType === 'string');
    });
    it('returns criteria object when 1st arg is an Error constructor and 2nd arg is a regexp', function () {
      var errMsgMatcher = /waffles/;
      var criteria = checkError.createCriteria(Error, errMsgMatcher);
      assert(criteria.errLike === Error);
      assert(criteria.errLikeType === 'error-constructor');
      assert(criteria.errMsgMatcher === errMsgMatcher);
      assert(criteria.errMsgMatcherType === 'regexp');
    });
    it('returns criteria object when only arg is an Error constructor', function () {
      var criteria = checkError.createCriteria(Error);
      assert(criteria.errLike === Error);
      assert(criteria.errLikeType === 'error-constructor');
      assert(criteria.errMsgMatcher === undefined);
      assert(criteria.errMsgMatcherType === 'undefined');
    });
    it('returns criteria object when only arg is a subclassed Error constructor', function () {
      var criteria = checkError.createCriteria(TypeError);
      assert(criteria.errLike === TypeError);
      assert(criteria.errLikeType === 'error-constructor');
      assert(criteria.errMsgMatcher === undefined);
      assert(criteria.errMsgMatcherType === 'undefined');
    });
    it('returns criteria object when only arg is an Error instance', function () {
      var criteria = checkError.createCriteria(errObj);
      assert(criteria.errLike === errObj);
      assert(criteria.errLikeType === 'error');
      assert(criteria.errMsgMatcher === undefined);
      assert(criteria.errMsgMatcherType === 'undefined');
    });
    it('returns criteria object when only arg is a subclassed Error instance', function () {
      var criteria = checkError.createCriteria(subErrObj);
      assert(criteria.errLike === subErrObj);
      assert(criteria.errLikeType === 'error');
      assert(criteria.errMsgMatcher === undefined);
      assert(criteria.errMsgMatcherType === 'undefined');
    });
    it('defaults to the Error constructor when no args and returns a criteria object', function () {
      var criteria = checkError.createCriteria();
      assert(criteria.errLike === Error);
      assert(criteria.errLikeType === 'error-constructor');
      assert(criteria.errMsgMatcher === undefined);
      assert(criteria.errMsgMatcherType === 'undefined');
    });
    it('defaults to the Error constructor when only arg is a string and returns a criteria object', function () {
      var criteria = checkError.createCriteria('waffles');
      assert(criteria.errLike === Error);
      assert(criteria.errLikeType === 'error-constructor');
      assert(criteria.errMsgMatcher === 'waffles');
      assert(criteria.errMsgMatcherType === 'string');
    });
    it('defaults to the Error constructor when only arg is a regexp and returns a criteria object', function () {
      var errMsgMatcher = /waffles/;
      var criteria = checkError.createCriteria(errMsgMatcher);
      assert(criteria.errLike === Error);
      assert(criteria.errLikeType === 'error-constructor');
      assert(criteria.errMsgMatcher === errMsgMatcher);
      assert(criteria.errMsgMatcherType === 'regexp');
    });
    it('throws when 1st arg is a string and 2rd arg is defined', function () {
      assertError(function () {
        checkError.createCriteria('waffles', 'waffles');
      }, 'errMsgMatcher must be null or undefined when errLike is a string or regular expression');
    });
    it('throws when 1st arg isn\'t an Error constructor, Error instance, string, or regexp', function () {
      assertError(function () {
        checkError.createCriteria(notErrObj);
      }, 'errLike must be an Error constructor or instance');
    });
    it('throws when 2nd arg is defined but not a string or regexp', function () {
      assertError(function () {
        checkError.createCriteria(Error, notErrObj);
      }, 'errMsgMatcher must be a string or regular expression');
    });
    it('throws when 1st arg is an Error instance and 2rd arg is defined', function () {
      assertError(function () {
        checkError.createCriteria(errObj, 'waffles');
      }, 'errMsgMatcher must be null or undefined when errLike is an Error instance');
    });
  });

  describe('describeExpectedError', function () {
    it('returns description when passed the Error constructor and a string', function () {
      var criteria = checkError.createCriteria(Error, 'waffles');
      assert(checkError.describeExpectedError(criteria) === 'an Error including \'waffles\'');
    });
    it('returns description when passed the Error constructor and a regexp', function () {
      var criteria = checkError.createCriteria(Error, /waffles/);
      assert(checkError.describeExpectedError(criteria) === 'an Error matching /waffles/');
    });
    it('returns description when passed the Error constructor alone', function () {
      var criteria = checkError.createCriteria(Error);
      assert(checkError.describeExpectedError(criteria) === 'an Error');
    });
    it('returns description when passed a subclassed Error constructor', function () {
      var criteria = checkError.createCriteria(TypeError, 'waffles');
      assert(checkError.describeExpectedError(criteria) === 'a TypeError including \'waffles\'');
    });
    it('returns .toString result in brackets when passed an Error instance', function () {
      var criteria = checkError.createCriteria(new Error('waffles'));
      assert(checkError.describeExpectedError(criteria) === '[Error: waffles]');
    });
    it('returns .toString result in brackets when passed a subclassed Error instance', function () {
      var criteria = checkError.createCriteria(new TypeError('waffles'));
      assert(checkError.describeExpectedError(criteria) === '[TypeError: waffles]');
    });
    it('defaults to the Error constructor and returns description when no args passed', function () {
      var criteria = checkError.createCriteria();
      assert(checkError.describeExpectedError(criteria) === 'an Error');
    });
    it('defaults to the Error constructor and returns description when passed a string alone', function () {
      var criteria = checkError.createCriteria('waffles');
      assert(checkError.describeExpectedError(criteria) === 'an Error including \'waffles\'');
    });
    it('defaults to the Error constructor and returns description when passed a regexp alone', function () {
      var criteria = checkError.createCriteria(/waffles/);
      assert(checkError.describeExpectedError(criteria) === 'an Error matching /waffles/');
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
});
