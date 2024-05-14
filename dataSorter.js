const fs = require("fs");

const jsonData = require("./output.json");

function sortJsonData(a, b) {
  const priorityOrder = { NO1: 1, NO2: 2, NO3: 3, NO4: 4 };
  const priorityA = priorityOrder[a.BArea] || Number.MAX_SAFE_INTEGER;
  const priorityB = priorityOrder[b.BArea] || Number.MAX_SAFE_INTEGER;

  if (priorityA !== priorityB) {
    return priorityA - priorityB;
  }

  if (a["Product Code"] < b["Product Code"]) return -1;
  if (a["Product Code"] > b["Product Code"]) return 1;

  return 0;
}

const sortedData = jsonData
  .filter((entry) => ["NO1", "NO2", "NO3", "NO4"].includes(entry.BArea))
  .map((entry) => ({
    ...entry,
    TotalPrice: parseFloat(entry.QTY) * parseFloat(entry.Price),
  }))
  .sort(sortJsonData);

fs.writeFile(
  "sorted_with_total_price.json",
  JSON.stringify(sortedData, null, 2),
  (err) => {
    if (err) {
      console.error("Error occurred while writing sorted JSON to file:", err);
    } else {
      console.log("JSON data sorted and saved to sorted_with_total_price.json");
    }
  }
);
