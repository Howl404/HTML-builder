const fs = require("fs");
const path = require("path");

fs.promises
  .readdir(__dirname + "/styles", { withFileTypes: true })
  .then((data) => {
    let filtered = [];
    data.forEach(function (file) {
      fileName = file.name;
      index = fileName.lastIndexOf(".");
      if (fileName.slice(index + 1, fileName.length) !== "css") {
        return;
      } else {
        filtered.push(fileName);
      }
    });
    return filtered;
  })
  .then((filtered) => {
    fs.rm(
      `${__dirname}/project-dist/bundle.css`,
      { recursive: true, force: true },
      (err) => {
        if (err) throw err;

        fs.appendFile(__dirname + "/project-dist/bundle.css", "", (err) => {
          if (err) throw err;

          filtered.forEach(function (file) {
            let readable = fs.createReadStream(
              path.join(__dirname, `styles/${file}`)
            );

            readable.on("data", (data) => {
              fs.appendFile(
                __dirname + "/project-dist/bundle.css",
                data,
                (err) => {
                  if (err) throw err;
                }
              );
            });
          });
        });
      }
    );
  });
