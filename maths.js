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

// Define the range of values for the product codes (01 to 24)
const productCodeRange = Array.from({ length: 24 }, (_, i) => i + 1).map(
  (num) => num.toString().padStart(2, "0")
);

// Iterate over each BArea
const extractedData = [];
groupedArray.forEach((entry) => {
  const BArea = entry.BArea;
  productCodeRange.forEach((code) => {
    const productCode = entry["Product Code"].slice(0, -2) + code; // Append the code to the existing product code
    const key = productCode + "-" + BArea;
    if (!groupedData[key]) {
      // Add a new object with the product code, BArea, and value of "undefined"
      extractedData.push({
        "Product Code": productCode,
        BArea: BArea,
        AveragePricePerUnit: undefined,
      });
    } else {
      // Add the existing entry if it exists
      extractedData.push({
        "Product Code": productCode,
        BArea: BArea,
        AveragePricePerUnit: groupedData[key]["AveragePricePerUnit"],
      });
    }
  });
});

// Convert extracted data to CSV format
const csv = extractedData
  .map(
    (entry) =>
      `${entry["Product Code"]},${entry["BArea"]},${entry["AveragePricePerUnit"]}`
  )
  .join("\n");

// Write the CSV data to a new file
fs.writeFile("extracted_data.csv", csv, (err) => {
  if (err) {
    console.error("Error occurred while writing CSV to file:", err);
  } else {
    console.log("CSV data extracted and saved to extracted_data.csv");
  }
});
