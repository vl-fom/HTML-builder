const path = require('path');
const fs = require('fs');

let stream = new fs.ReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
stream.on('readable', function() {
  let data = stream.read();
  if (data != null) {
    console.log(data);
  }
});