import traverseFiles from '../lib/traverseFiles';

let map = {};
traverseFiles(__dirname, (filename, filePath, stat) => {
  if(filename !== 'index.js' && filename !== 'BaseRepository.js') {
    let klass = require(filePath).default;
    map[klass.name] = klass;
  }
});

export default map;
