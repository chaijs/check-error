import { createContext, runInContext } from 'node:vm';
import { assert } from 'simple-assert';
import * as checkError from '../index.js';

const vmContext = { checkError };
createContext(vmContext);

function runCodeInVm(code) {
  return runInContext(`{${ code }}`, vmContext);
}

describe('node virtual machines', function () {
  it('compatibleMessage', function () {
    assert(runCodeInVm(`
      const errorInstance = new Error('I am an instance');
      checkError.compatibleMessage(errorInstance, /instance$/) === true;
    `) === true);
  });

  it('constructorName', function () {
    assert(runCodeInVm(`
      const errorInstance = new Error('I am an instance');
      checkError.getConstructorName(errorInstance);
    `) === 'Error');
    assert(runCodeInVm(`
      const derivedInstance = new TypeError('I inherit from Error');
      checkError.getConstructorName(derivedInstance);
    `) === 'TypeError');
  });

  it('compatibleInstance', function () {
    assert(runCodeInVm(`
      const errorInstance = new Error('I am an instance');
      const sameInstance = errorInstance;
      checkError.compatibleInstance(errorInstance, sameInstance);
    `) === true);
    assert(runCodeInVm(`
      const errorInstance = new Error('I am an instance');
      const otherInstance = new Error('I am another');
      checkError.compatibleInstance(errorInstance, otherInstance);
    `) === false);
  });

  it('compatibleConstructor', function () {
    assert(runCodeInVm(`
      const errorInstance = new Error('I am an instance');
      const sameInstance = errorInstance;
      checkError.compatibleConstructor(errorInstance, sameInstance);
    `) === true);
    assert(runCodeInVm(`
      const errorInstance = new Error('I am an instance');
      const otherInstance = new Error('I an another instance');
      checkError.compatibleConstructor(errorInstance, otherInstance);
    `) === true);
    assert(runCodeInVm(`
      const errorInstance = new Error('I am an instance');
      const derivedInstance = new TypeError('I inherit from Error');
      checkError.compatibleConstructor(derivedInstance, errorInstance);
    `) === true);
    assert(runCodeInVm(`
      const errorInstance = new Error('I am an instance');
      const derivedInstance = new TypeError('I inherit from Error');
      checkError.compatibleConstructor(errorInstance, derivedInstance);
    `) === false);
    assert(runCodeInVm(`
      const errorInstance = new TypeError('I am an instance');
      checkError.compatibleConstructor(errorInstance, TypeError);
    `) === true);
  });
});
