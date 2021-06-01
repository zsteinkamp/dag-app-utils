import { expect } from 'chai';
import DagAppUtils from '..';

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
