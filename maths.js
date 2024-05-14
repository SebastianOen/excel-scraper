const fs = require("fs");

const jsonData = require("./sorted_with_total_price.json");

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

const groupedArray = Object.values(groupedData);

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
