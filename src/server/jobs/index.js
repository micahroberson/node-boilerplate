import traverseFiles from '../lib/traverseFiles';

let map = {};
traverseFiles(__dirname, (filename, filePath, stat) => {
  if(filename !== 'index.js' && filename !== 'BaseJob.js') {
    let klass = require(filePath).default;
    map[klass.name] = klass;
  }
});

export default map;
