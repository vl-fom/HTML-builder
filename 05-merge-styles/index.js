const path = require('path');
const fs = require('fs');

let stylesArr = [];

let readStyles = new Promise(function(resolve){
  fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
    files = files.filter((file) => file.isFile() && path.extname(file.name) === '.css');
    files.forEach((file) => {
      let rs = new fs.ReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
      rs.on('readable', () => {
        let data = rs.read();
        if (data != null) {
          stylesArr.push(data);
          if (stylesArr.length === files.length) {
            resolve();
          }
        }
      });
    });
  });
});

readStyles.then(() => {
  let ws = new fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8');
  stylesArr.forEach((file) => {
    ws.write(file);
    if(file.slice(-1) !== '\n') {
      ws.write('\n');
    }
  });
  ws.end();
});