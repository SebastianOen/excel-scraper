const fs = require("fs");
const csv = require("csv-parser");

const csvFile =
  "C:\\Users\\Sebas\\OneDrive\\Dokumenter\\GitHub\\excel-scraper\\csvFiles\\elbas_ticker_report_20230104.csv";
const jsonData = [];

fs.createReadStream(csvFile)
  .on("error", (err) => {
    console.error("Error occurred while reading the file:", err);
  })
  .pipe(csv())
  .on("data", (row) => {
    jsonData.push(row);
  })
  .on("end", () => {
    const jsonContent = JSON.stringify(jsonData, null, 2);
    fs.writeFile("output.json", jsonContent, (err) => {
      if (err) {
        console.error("Error occurred while writing JSON to file:", err);
      } else {
        console.log("CSV data converted to JSON and saved to output.json");
      }
    });
  });
