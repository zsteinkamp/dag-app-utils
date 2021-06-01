import { expect } from 'chai';
import DagAppUtils from '..';

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
