import { expect } from 'chai';
import DagAppUtils from '..';

describe('DagAppUtils', () => {
  describe('dau.dag', () => {
    it('returns an object', () => {
      const dau = new DagAppUtils({});
      expect(dau.dag).to.be.an('object');
    });
    it('adds children', () => {
      const dau = new DagAppUtils({
        foo: {
          type: 'input'
        },
        bar: {
          type: 'calc',
          parents: [ 'foo' ],
          calc: (data) => {
            return data['foo'] + 5;
          }
        }
      });
      expect(dau.dag).to.be.an('object');
      console.log(dau.dag);
    });
  });
});
