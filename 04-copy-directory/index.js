const fs = require("fs");

fs.promises
  .readdir(__dirname + "/files", { withFileTypes: true })

  .then(function (files) {
    fs.rm(
      `${__dirname}/files-copy`,
      { recursive: true, force: true },
      (err) => {
        if (err) throw err;

        fs.mkdir(__dirname + "/files-copy", { recursive: true }, (err) => {
          if (err) throw err;

          files.forEach(function (file) {
            fs.copyFile(
              __dirname + `/files/${file.name}`,
              __dirname + `/files-copy/${file.name}`,
              function (err) {
                if (err) throw err;
              }
            );
          });
        });
      }
    );
  });
