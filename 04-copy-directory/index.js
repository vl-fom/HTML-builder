const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

fsPromises.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });

fs.readdir(path.join(__dirname, 'files'), (err, files) => {
  files.forEach((file) => {
    fsPromises.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file));
  });
});

fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
  files.forEach((file) => {
    fs.access(path.join(__dirname, 'files', file), (err) => {
      if (err) {
        fs.rm(path.join(__dirname, 'files-copy', file), () => {});
      }
    });
  });
});
