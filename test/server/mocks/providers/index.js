import traverseFiles from '../../../../src/server/lib/traverseFiles';

let map = {};
traverseFiles(__dirname, (filename, filePath, stat) => {
  if(filename !== 'index.js' && filename !== 'BaseProvider.js') {
    let klass = require(filePath).default;
    map[klass.name] = klass;
  }
});

export default map;
