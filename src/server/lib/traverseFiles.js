import fs from 'fs';
import path from 'path';

export default function traverseFiles(dirPath, cb) {
  fs.readdirSync(dirPath).forEach(name => {
    let filePath = path.join(dirPath, name);
    let stat = fs.statSync(filePath);
    if(stat.isFile()) {
      cb(name, filePath, stat);
    } else if(stat.isDirectory()) {
      traverseFiles(filePath, cb);
    }
  })
}