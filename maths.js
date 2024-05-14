const fs = require("fs");

// Read the JSON file
const jsonData = require("./sorted_with_total_price.json");

// Group entries by Product Code and BArea
const groupedData = jsonData.reduce((acc, entry) => {
  const key = entry["Product Code"] + "-" + entry.BArea;
  if (!acc[key]) {
    acc[key] = {
      "Product Code": entry["Product Code"],
      BArea: entry.BArea,
      TotalQTY: parseFloat(entry.QTY),
      TotalTimePrice: parseFloat(entry.TotalPrice),
      AveragePricePerUnit: parseFloat(entry.TotalPrice) / parseFloat(entry.QTY),
    };
  } else {
    acc[key].TotalQTY += parseFloat(entry.QTY);
    acc[key].TotalTimePrice += parseFloat(entry.TotalPrice);
    acc[key].AveragePricePerUnit = acc[key].TotalTimePrice / acc[key].TotalQTY;
  }
  return acc;
}, {});

// Convert grouped data to array
const groupedArray = Object.values(groupedData);

// Write the grouped data to a new JSON file
fs.writeFile(
  "grouped_with_total_qty_time_price_avg_price.json",
  JSON.stringify(groupedArray, null, 2),
  (err) => {
    if (err) {
      console.error("Error occurred while writing grouped JSON to file:", err);
    } else {
      console.log(
        "JSON data grouped by Product Code and BArea with total QTY, total time price, and average price per unit saved to grouped_with_total_qty_time_price_avg_price.json"
      );
    }
  }
);

// Extract Product Code and AveragePricePerUnit fields
const extractedData = groupedArray.map((entry) => ({
  "Product Code": entry["Product Code"],
  AveragePricePerUnit: entry["AveragePricePerUnit"],
}));

// Convert extracted data to CSV format
const csv = extractedData
  .map((entry) => `${entry["Product Code"]},${entry["AveragePricePerUnit"]}`)
  .join("\n");

// Write the CSV data to a new file
fs.writeFile("extracted_data.csv", csv, (err) => {
  if (err) {
    console.error("Error occurred while writing CSV to file:", err);
  } else {
    console.log("CSV data extracted and saved to extracted_data.csv");
  }
});
