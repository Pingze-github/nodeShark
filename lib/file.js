
const fs = require('fs');
const PATH = require('path');

class File {
  constructor(path) {
    if (path) this.open(path);
  }
  open(path) {
    this.path = path;
    this.abspath = PATH.resolve(this.path);
    this.name = PATH.basename(this.path);
    this.buffer = fs.readFileSync(this.path);
  }
}

module.exports = File;