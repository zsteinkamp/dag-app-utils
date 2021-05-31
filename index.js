const TYPE_ROOT = 'root';
const TYPE_INPUT = 'input';
const TYPE_CALC = 'calc';
const VALID_TYPES = [ TYPE_ROOT, TYPE_INPUT, TYPE_CALC ];
const ROOT_KEY = '__root__';
import { cloneDeep } from 'lodash';

export default class DagAppUtils {
  constructor(dag) {
    this.values = {};
    this.validateDag(dag);
    this.dag = this.prepareDag(cloneDeep(dag));
    this.seedDefaultValues();
  }

  validateDag(dag) {
    if (typeof(dag) !== 'object' || dag === null) {
      throw new Error(`dag must be an object. ${typeof(dag)} given.`);
    }
    if (dag[ROOT_KEY]) {
      throw new Error(`dag must not have a property named ${ROOT_KEY}.`);
    }
    for (const key in dag) {
      const meta = dag[key];
      if (typeof(meta.type) === 'undefined') {
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
  }

  prepareDag(dag) {
    dag[ROOT_KEY] = {
      type: TYPE_ROOT,
      children: []
    };

    for (const key in dag) {
      const meta = dag[key];
      if (meta.type === TYPE_INPUT) {
        dag[ROOT_KEY].children.push(key);
      }
      if (meta.parents) {
        for (const parent of meta.parents) {
          // set up children
          if (!dag[parent]) {
            throw new Error(`Dag key [${key}] refers to missing parent [${parent}]`);
          }
          if (!dag[parent].children) {
            dag[parent].children = [];
          }
          dag[parent].children.push(key);
        }
      }
    }
    return dag;
  }

  seedDefaultValues() {
    this.data = {};
  }

  calc() {
    return this.dag;
  }
}
