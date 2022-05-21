const path = require('path');
const fs = require('fs');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err, files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
        let fileName = file.name.slice(0, file.name.indexOf(path.extname(file.name)));
        let extName = path.extname(file.name).slice(1);
        console.log(`${fileName} - ${extName} - ${stats.size}b`);
      });
    }
  });
});