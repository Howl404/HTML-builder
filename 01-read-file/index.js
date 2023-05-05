const fs = require('node:fs');
const path = require('node:path');

let readable = fs.createReadStream(path.join(__dirname, './text.txt'));

readable.on('data', (data) => {
  console.log(data.toString());
});
