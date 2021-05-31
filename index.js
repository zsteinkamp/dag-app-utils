const TYPE_ROOT = 'root';
const TYPE_INPUT = 'input';
const TYPE_CALC = 'calc';
const VALID_TYPES = [ TYPE_ROOT, TYPE_INPUT, TYPE_CALC ];

export default class DagAppUtils {
  constructor(dag) {
    this._data = {};
    this.validateDag(dag);
    this.dag = this.prepareDag(dag);
    this.seedDefaults(this.data);
  }

  dag() {
    return this.dag;
  }

  validateDag(dag) {
    if (typeof(dag) !== 'object' || dag === null) {
      throw new Error(`dag must be an object. ${typeof(dag)} given.`);
    }
    for (const key in dag) {
      const meta = dag[key];
      if (typeof(meta.type) === 'undefined') {
        throw new Error(`Dag key [${key}] missing 'type' property.`);
      }
    }
  }

  prepareDag(dag) {
    const newDag = {};
    newDag._root = {
      type: TYPE_ROOT
    };
    return newDag;
  }

  seedDefaults(data) {
  }

  calc() {
    return this.dag;
  }
}
