const TYPE_INPUT = 'input';
const TYPE_CALC = 'calc';
const VALID_TYPES = [ TYPE_INPUT, TYPE_CALC ];
import { cloneDeep } from 'lodash';

export default class DagAppUtils {
  constructor(dag) {
    this.dagMeta = {
      inputs: []
    };
    this.values = {};
    this.dag = this.validateDag(cloneDeep(dag));
    this.prepareDag();
    this.seedDefaultValues();
  }

  validateDag(dag) {
    if (typeof(dag) !== 'object' || dag === null) {
      throw new Error(`dag must be an object. ${typeof(dag)} given.`);
    }
    for (const key in dag) {
      const meta = dag[key];
      if (meta.type === undefined) {
        throw new Error(`Dag key [${key}] missing 'type' property.`);
      }
      if (typeof(meta.type) !== 'string') {
        throw new Error(`Dag key [${key}] 'type' property must be a string.`);
      }
      if (!VALID_TYPES.includes(meta.type)) {
        throw new Error(`Dag key [${key}] 'type' property must be one of: ${VALID_TYPES.join(', ')}. [${meta.type}] given.`);
      }
      if (meta.type === TYPE_CALC) {
        if (typeof(meta.calc) !== 'function') {
          throw new Error(`Dag key [${key}] is defined as type=${meta.type} but does not have a calc property that is a function.`);
        }
        if (!Array.isArray(meta.parents)) {
          throw new Error(`Dag key [${key}] is defined as type=${meta.type} but does not have a parents property that is an array.`);
        }
      }
    }
    // all good so return it to be assigned to the instance property
    return dag;
  }

  prepareDag() {
    for (const key in this.dag) {
      const meta = this.dag[key];
      if (meta.type === TYPE_INPUT) {
        this.dagMeta.inputs.push(key);
      }
      if (meta.parents) {
        for (const parent of meta.parents) {
          // set up children
          if (!this.dag[parent]) {
            throw new Error(`Dag key [${key}] refers to missing parent [${parent}]`);
          }
          if (!this.dag[parent].children) {
            this.dag[parent].children = [];
          }
          this.dag[parent].children.push(key);
        }
      }
    }

    // recursive method to calculate depth values for each node
    const calcDepth = (key) => {
      //console.log(`CALCDEPTH ${key}`);
      const meta = this.dag[key];
      if (meta.depth !== undefined) {
        return;
      }
      if (meta.type === TYPE_INPUT) {
        // inputs are always depth===0
        meta.depth = 0;
        return;
      }
      if (meta.type === TYPE_CALC) {
        for (const parentKey of meta.parents) {
          const parentMeta = this.dag[parentKey];
          if (parentMeta.depth === undefined) {
            // recurse
            calcDepth(parentKey);
          }
        }
        const parentDepths = meta.parents.map((parentKey) => { return this.dag[parentKey].depth; });
        meta.depth = Math.max(...parentDepths) + 1;
        return;
      }
    };
    // calculate depth of each node
    for (const key in this.dag) {
      calcDepth(key);
    }
    //console.log(this.dag);
  }

  seedDefaultValues() {
    for (const key in this.dag) {
      const meta = this.dag[key];
      if (meta.type === TYPE_INPUT && meta.default !== undefined) {
        this.values[key] = meta.default;
      }
    }
  }

  calc(modifiedKeys = []) {
    // if passed a string, make into an array
    if (typeof(modifiedKeys) === 'string') {
      modifiedKeys = [modifiedKeys];
    }

    // modifiedKeys must be an array by this point
    if (!Array.isArray(modifiedKeys)) {
      throw new Error(`Must pass an array of modifiedKeys to calc. [${typeof modifiedKeys}] given.`);
    }

    // if modifiedKeys is empty, that means do a full recalc
    if (modifiedKeys.length === 0) {
      modifiedKeys = this.dagMeta.inputs;
    }
    else {
      // verify each key in modifiedKeys exists
      for (const key of modifiedKeys) {
        if (!this.dag.meta[key]) {
          throw new Error(`Unknown key [${key}] passed to calc().`);
        }
      }
    }

    // collect the child keys of modified keys (one level deep) then sort ascending on depth to then recursively call calc
    const childKeys = new Set();

    for (const key of modifiedKeys) {
      const meta = this.dag[key];
      if (meta.children) {
        for (const childKey of meta.children) {
          childKeys.add(childKey);
        }
      }
    }

    const sortedChildKeys = Array.from(childKeys);
    sortedChildKeys.sort( (a, b) => {
      return this.dag[a].depth - this.dag[b].depth;
    });

    // recursive method that actually calls calc
    const doCalc = (key) => {
      const meta = this.dag[key];
      this.values[key] = meta.calc(this.values);
      if (meta.children) {
        for (const childKey of meta.children) {
          doCalc(childKey);
        }
      }
    };

    for (const key of sortedChildKeys) {
      doCalc(key);
    }

    return this.values;
  }
}
