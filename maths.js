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

      const productCodeRange = Array.from({ length: 24 }, (_, i) => i + 1).map(
        (num) => num.toString().padStart(2, "0")
      );

      const extractedData = [];

      groupedArray.forEach((entry) => {
        const BArea = entry.BArea;
        productCodeRange.forEach((code) => {
          const productCode = entry["Product Code"].slice(0, -2) + code; // Append the code to the existing product code
          const key = productCode + "-" + BArea;
          if (!productCode.includes("-PH-")) {
            const existingEntry = extractedData.find(
              (item) =>
                item["Product Code"] === productCode && item["BArea"] === BArea
            );
            if (!existingEntry) {
              extractedData.push({
                "Product Code": productCode,
                BArea: BArea,
                AveragePricePerUnit: groupedData[key]
                  ? groupedData[key]["AveragePricePerUnit"]
                  : undefined,
              });
            }
          }
        });
      });

      const csv = extractedData
        .map(
          (entry) =>
            `${entry["Product Code"]},${entry["BArea"]},${entry["AveragePricePerUnit"]}`
        )
        .join("\n");

      fs.writeFile("extracted_data.csv", csv, (err) => {
        if (err) {
          console.error("Error occurred while writing CSV to file:", err);
        } else {
          console.log("CSV data extracted and saved to extracted_data.csv");

          const destinationFolderPath =
            "C:\\Users\\Sebas\\OneDrive\\Dokumenter\\Data\\2023\\sortert";

          const destinationFilePath = `${destinationFolderPath}\\extracted_data.csv`;

          fs.copyFile("extracted_data.csv", destinationFilePath, (err) => {
            if (err) {
              console.error("Error occurred while copying the file:", err);
            } else {
              console.log(`CSV file copied to ${destinationFilePath}`);

              fs.unlink("sorted_with_total_price.json", (err) => {
                if (err) {
                  console.error(
                    "Error occurred while deleting sorted JSON file:",
                    err
                  );
                } else {
                  console.log("Sorted JSON file deleted");
                }
              });

              fs.unlink(
                "grouped_with_total_qty_time_price_avg_price.json",
                (err) => {
                  if (err) {
                    console.error(
                      "Error occurred while deleting grouped JSON file:",
                      err
                    );
                  } else {
                    console.log("Grouped JSON file deleted");
                  }
                }
              );

              fs.unlink("output.json", (err) => {
                if (err) {
                  console.error(
                    "Error occurred while deleting output JSON file:",
                    err
                  );
                } else {
                  console.log("Output JSON file deleted");
                }
              });
            }
          });
        }
      });
    }
  }
);
