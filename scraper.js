const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const folderPath = ""; // Insert path to folder with CSV files here

function readCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const allJsonData = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        allJsonData.push(row);
      })
      .on("end", () => {
        console.log(
          `CSV data from ${path.basename(filePath)} converted to JSON`
        );
        resolve(allJsonData);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

fs.readdir(folderPath, async (err, files) => {
  if (err) {
    console.error("Error occurred while reading the folder:", err);
    return;
  }

  const promises = [];

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    promises.push(readCsvFile(filePath));
  });

  try {
    const jsonDataArray = await Promise.all(promises);

    const allJsonData = jsonDataArray.flat();

    fs.writeFile("output.json", JSON.stringify(allJsonData, null, 2), (err) => {
      if (err) {
        console.error("Error occurred while writing JSON to file:", err);
      } else {
        console.log("All CSV data converted to JSON and saved to output.json");
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
});
