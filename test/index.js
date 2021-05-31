import { expect } from 'chai';
import DagAppUtils from '..';

describe('DagAppUtils', () => {
  describe('constructor', () => {
    it('returns an object', () => {
      const dau = new DagAppUtils({});
      expect(dau.dag).to.be.an('object');
    });
  });
  describe('validateDag', () => {
    it('throws when missing type', () => {
      expect( () => { DagAppUtils({
        foo: {
        }
      }); }).to.throw();
    });
    it('throws when given a weird type', () => {
      expect( () => { DagAppUtils({
        foo: {
          type: 'bingo'
        }
      }); }).to.throw();
    });
    it('throws when missing calc function', () => {
      expect( () => { DagAppUtils({
        bar: {
          type: 'calc',
          parents: [ 'foo' ]
        }
      }); }).to.throw();
    });
    it('throws when calc function is wrong type', () => {
      expect( () => { DagAppUtils({
        bar: {
          type: 'calc',
          parents: [ 'foo' ],
          calc: 'bar'
        }
      }); }).to.throw();
    });
    it('throws when missing parent', () => {
      expect( () => { DagAppUtils({
        bar: {
          type: 'calc',
          parents: [ 'foo' ],
          calc: (data) => {
            return data['foo'] + 5;
          }
        }
      }); }).to.throw();
    });
  });
  describe('prepareDag', () => {
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
      expect(dau.dag.foo.children).to.be.an('array');
    });
    it('calculates depth properly', () => {
      const dau = new DagAppUtils({
        foo: {
          type: 'input'
        },
        bar: {
          type: 'input'
        },
        baz: {
          type: 'calc',
          parents: [ 'foo', 'bar' ],
          calc: (data) => {
            return data['foo'] + data['bar'];
          }
        },
        bif: {
          type: 'calc',
          parents: [ 'baz' ],
          calc: (data) => {
            return data['baz'];
          }
        },
        bop: {
          type: 'input'
        },
        bip: {
          type: 'calc',
          parents: [ 'bop' ],
          calc: (data) => {
            return data['bop'];
          }
        }
      });
      expect(dau.dag.foo.depth).to.equal(0);
      expect(dau.dag.bar.depth).to.equal(0);
      expect(dau.dag.baz.depth).to.equal(1);
      expect(dau.dag.bif.depth).to.equal(2);
      expect(dau.dag.bop.depth).to.equal(0);
      expect(dau.dag.bip.depth).to.equal(1);
    });
  });
  describe('calc', () => {
    it('calcs properly', () => {
      const dau = new DagAppUtils({
        foo: {
          default: 5,
          type: 'input'
        },
        bar: {
          default: 5,
          type: 'input'
        },
        baz: {
          type: 'calc',
          parents: [ 'foo', 'bar' ],
          calc: (data) => {
            return data['foo'] + data['bar'];
          }
        }
      });
      dau.calc();
      expect(dau.values.foo).to.equal(5);
      expect(dau.values.bar).to.equal(5);
      expect(dau.values.baz).to.equal(10);
    });
  });
});
