const readline = require("readline");
const fs = require("fs");
const path = require("path");

let rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt("Enter the text: ");
rl.prompt();
fs.appendFile(path.join(__dirname, "/text.txt"), "", function (err) {
  if (err) throw err;
});

rl.on("line", (data) => {
  if (data === "exit") {
    console.log("  Прощайте");
    rl.close();
    return;
  }
  fs.appendFile(path.join(__dirname, "/text.txt"), data, function (err) {
    if (err) throw err;
  });
});

rl.on("SIGINT", () => {
  console.log(`
  Прощайте`);
  rl.close();
});
