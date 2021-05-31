import { expect } from 'chai';
import DagAppUtils from '..';

describe('DagUtils', () => {
  describe('sample', () => {
    it('returns true', () => {
      const du = new DagAppUtils({});
      expect(du.meta).to.be.an('object');
    });
  });
});
