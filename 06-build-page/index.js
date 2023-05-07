const fs = require('fs');
const path = require('node:path');
let template = '';

fs.rm(`${__dirname}/project-dist`, { recursive: true, force: true }, (err) => {
  if (err) throw err;
  fs.mkdir(`${__dirname}/project-dist`, (err) => {
    if (err) throw err;
    let readable = fs.createReadStream(path.join(__dirname, './template.html'));

    readable.on('data', (data) => {
      template = data.toString();
      fs.promises
        .readdir(__dirname + '/components', { withFileTypes: true })
        .then((files) => {
          const promises = files.map((file) => {
            let fileName = file.name;
            let index = fileName.lastIndexOf('.');
            if (fileName.slice(index + 1, fileName.length) !== 'html') {
              return Promise.resolve();
            }
            let readable = fs.createReadStream(
              path.join(__dirname, `./components/${fileName}`)
            );
            return new Promise((resolve, reject) => {
              let content = '';
              readable.on('data', (data) => {
                content += data.toString();
              });
              readable.on('end', () => {
                resolve({ name: fileName.slice(0, index), content });
              });
              readable.on('error', reject);
            });
          });
          return Promise.all(promises).then((components) => ({ components }));
        })
        .then(({ components }) => {
          let lines = template.split('\n');
          components.forEach(({ name, content }) => {
            const identifier = `{{${name}}}`;
            lines = lines.map(line => {
              if (line.includes(identifier)) {
                const whitespace = line.match(/^\s*/)[0];
                const newContent = content.split('\n').map((componentLine) =>
                  whitespace + componentLine).join('\n');
                return newContent;
              } else {
                return line;
              }
            });
          });
          template = lines.join('\n');
          return fs.promises.appendFile(
            path.join(__dirname, '/project-dist/index.html'),
            template.trim()
          );
        })
        .then(() => {
          fs.promises
            .readdir(__dirname + '/styles', { withFileTypes: true })
            .then((data) => {
              let filtered = [];
              data.forEach(function (file) {
                let fileName = file.name;
                let index = fileName.lastIndexOf('.');
                if (fileName.slice(index + 1, fileName.length) !== 'css') {
                  return;
                } else {
                  filtered.push(fileName);
                }
              });
              return filtered;
            })
            .then((filtered) => {
              fs.appendFile(__dirname + '/project-dist/style.css', '', (err) => {
                if (err) throw err;

                filtered.forEach(function (file) {
                  let readable = fs.createReadStream(
                    path.join(__dirname, `styles/${file}`)
                  );

                  readable.on('data', (data) => {
                    fs.appendFile(
                      __dirname + '/project-dist/style.css',
                      data,
                      (err) => {
                        if (err) throw err;
                      }
                    );
                  });
                });
              });
            })
            .then(() => {
              fs.promises
                .readdir(__dirname + '/assets', { withFileTypes: true })
          
                .then(function (files) {
                  fs.mkdir(__dirname + '/project-dist', { recursive: true }, (err) => {
                    if (err) throw err;
          
                    files.forEach(function (file) {
                      copyFiles(file.name);
                    });
                  });
                }
              
                );
            });
        });
    });
  });
});

const copyFiles = function (directory) {
  fs.promises
    .readdir(__dirname + `/assets/${directory}`, { withFileTypes: true })

    .then(function (files) {
      fs.mkdir(__dirname + `/project-dist/assets/${directory}`, { recursive: true }, (err) => {
        if (err) throw err;

        files.forEach(function (file) {
          fs.copyFile(
            __dirname + `/assets/${directory}/${file.name}`,
            __dirname + `/project-dist/assets/${directory}/${file.name}`,
            function (err) {
              if (err) throw err;
            }
          );
        });
      });
    }
    
    );
};