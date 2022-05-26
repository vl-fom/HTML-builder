const path = require('path');
const fs = require('fs');
let html = '', stylesArr = [], tags = [];
const fsPromises = fs.promises;

async function createTag (file) {
  return new Promise((resolve) => {
    if (file.isFile()) {
      fs.stat(path.join(__dirname, 'components', file.name), () => {
        let fileName = file.name.slice(0, file.name.indexOf(path.extname(file.name)));
        tags.push(fileName);
        resolve();
      });
    }
  });
}

async function replaceTag(tag) {
  return new Promise((resolve) => {
    fs.readFile(path.join(__dirname, `components/${tag}.html`), { encoding: 'utf-8' }, (err, data) => {
      if(err) {
        throw new Error(err);
      } 
      html = html.replace(('{{'.concat(tag, '}}')), data);
      resolve();
    });
  });
}

new Promise((resolve) => {
  fs.readFile(path.join(__dirname, 'template.html'), { encoding: 'utf-8' }, (err, data) => {
    if(err) {
      throw new Error(err);
    }
    html = data;
    resolve();
  });
})
  .then(() => {
    return new Promise((resolve) => {
      fs.readdir(path.join(__dirname, 'components'), {withFileTypes: true}, async (err, files) => {
        for (const file of files ){
          await createTag (file);
        }
        resolve();
      });
    });
  })
  .then(async () => {
    let promises = tags.map(replaceTag);
    await Promise.all(promises);
  })
  .then(() => {
    fsPromises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
  })
  .then(() => {
    return new Promise((resolve) => {
      let ws = new fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8');
      ws.write(html);
      ws.end();
      resolve();
    });
  })
  .then(() => {
    return new Promise((resolve) => {
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
  })
  .then(() => {
    return new Promise((resolve) => {
      let ws = new fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'), 'utf-8');
      stylesArr.forEach((file) => {
        ws.write(file);
        if(file.slice(-1) !== '\n') {
          ws.write('\n');
        }
      });
      ws.end();
      resolve();
    });
  })
  .then(() => {
    fsPromises.mkdir(path.join(__dirname, 'project-dist/assets'), { recursive: true });
  })
  .then(() => {
    fsPromises.mkdir(path.join(__dirname, 'project-dist/assets/fonts'), { recursive: true });
  })
  .then(() => {
    fsPromises.mkdir(path.join(__dirname, 'project-dist/assets/img'), { recursive: true });
  })
  .then(() => {
    fsPromises.mkdir(path.join(__dirname, 'project-dist/assets/svg'), { recursive: true });
  })
  .then(() => {
    fs.readdir(path.join(__dirname, 'assets/fonts'), (err, files) => {
      files.forEach((file) => {
        fsPromises.copyFile(path.join(__dirname, 'assets/fonts', file), path.join(__dirname, 'project-dist/assets/fonts', file));
      });
    });
    
    fs.readdir(path.join(__dirname, 'project-dist/assets/fonts'), (err, files) => {
      files.forEach((file) => {
        fs.access(path.join(__dirname, 'assets/fonts', file), (err) => {
          if (err) {
            fs.rm(path.join(__dirname, 'project-dist/assets/fonts', file), () => {});
          }
        });
      });
    });
  })
  .then(() => {
    fs.readdir(path.join(__dirname, 'assets/img'), (err, files) => {
      files.forEach((file) => {
        fsPromises.copyFile(path.join(__dirname, 'assets/img', file), path.join(__dirname, 'project-dist/assets/img', file));
      });
    });
    
    fs.readdir(path.join(__dirname, 'project-dist/assets/img'), (err, files) => {
      files.forEach((file) => {
        fs.access(path.join(__dirname, 'assets/img', file), (err) => {
          if (err) {
            fs.rm(path.join(__dirname, 'project-dist/assets/img', file), () => {});
          }
        });
      });
    });
  })
  .then(() => {
    fs.readdir(path.join(__dirname, 'assets/svg'), (err, files) => {
      files.forEach((file) => {
        fsPromises.copyFile(path.join(__dirname, 'assets/svg', file), path.join(__dirname, 'project-dist/assets/svg', file));
      });
    });
    
    fs.readdir(path.join(__dirname, 'project-dist/assets/svg'), (err, files) => {
      files.forEach((file) => {
        fs.access(path.join(__dirname, 'assets/svg', file), (err) => {
          if (err) {
            fs.rm(path.join(__dirname, 'project-dist/assets/svg', file), () => {});
          }
        });
      });
    });
  });
