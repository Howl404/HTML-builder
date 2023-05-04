const fs = require("fs");
const path = require("path");

fs.promises
  .readdir(__dirname + "/secret-folder", { withFileTypes: true })

  .then((data) => {
    data.forEach(function (item) {
      if (item.isDirectory()) {
        return;
      } else {
        fs.stat(
          __dirname + `/secret-folder/${item.name}`,
          function (err, stat) {
            const size = stat.size;
            const name = item.name.slice(0, item.name.indexOf("."));
            let extension = path.extname(
              __dirname + `/secret-folder/${item.name}`
            );
            extension = extension.replace(".", "");
            console.log(`${name} - ${extension} - ${size}bytes`);
          }
        );
      }
    });
  });
