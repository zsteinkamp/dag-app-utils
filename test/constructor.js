import { expect } from 'chai';
import DagAppUtils from '..';

describe('constructor', () => {
  it('returns an object', () => {
    const dau = new DagAppUtils({});
    expect(dau.dag).to.be.an('object');
  });
});
