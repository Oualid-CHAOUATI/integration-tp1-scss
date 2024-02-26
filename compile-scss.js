// "use strict";

// const sass = require("sass");

// const fs = require("fs");
// const { writeFile } = fs;

// const creerFichier = async (chemin, contenu) =>
//   new Promise((resolve, reject) => {
//     writeFile(chemin, contenu, { encoding: "utf8" }, (err) => {
//       if (err) {
//         reject(err);
//         return;
//       }

//       resolve();
//     });
//   });

// const compilerSASS = (chemin) =>
//   new Promise((resolve, reject) =>
//     sass.render({ file: chemin }, (err, result) => {
//       if (err) {
//         reject(err);
//         return;
//       }

//       resolve(result.css.toString());
//     })
//   );

// (async () => {
//   const css = await compilerSASS(__dirname + "/src/css/main.css");
//   await creerFichier(__dirname + "/dist/css/main.css", css);
//   console.log("Compilation réussie!!");
// })();
"use strict";

const sass = require("sass");
const fs = require("fs");
const chokidar = require("chokidar");

const { writeFile } = fs;

const creerFichier = async (chemin, contenu) =>
  new Promise((resolve, reject) => {
    writeFile(chemin, contenu, { encoding: "utf8" }, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });

const compilerSASS = (chemin) =>
  new Promise((resolve, reject) =>
    sass.render({ file: chemin }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(result.css.toString());
    })
  );

const watchSASS = (chemin) => {
  const watcher = chokidar.watch(chemin, { ignoreInitial: true });
  watcher.on("change", async (sassFile) => {
    console.log(`File ${sassFile} has been changed`);
    const css = await compilerSASS(sassFile);
    await creerFichier(
      sassFile.replace(".scss", ".css").replace("src", "dist"),
      css
    );
    console.log("Compilation réussie!!");
  });
};

(async () => {
  await watchSASS(__dirname + "/src/css/*.scss");
})();
