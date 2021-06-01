import { expect } from 'chai';
import DagAppUtils from '..';

describe('calc', () => {
  it('calcs properly in a trivial case', () => {
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
    expect(dau.values.foo).to.equal(5);
    expect(dau.values.bar).to.equal(5);
    expect(dau.values.baz).to.equal(10);
  });
  it('calcs properly in multi-dag case', () => {
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
    dau.values = {
      foo: 5,
      bar: 6,
      bop: 7
    };
    dau.calc();
    expect(dau.values.foo).to.equal(5);
    expect(dau.values.bar).to.equal(6);
    expect(dau.values.baz).to.equal(11);
    expect(dau.values.bop).to.equal(7);
    expect(dau.values.bip).to.equal(7);
  });
});
