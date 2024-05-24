# Excel-scraper


This is a data scraper meant for gathering data from a very specific datafile from Nordpool. 
This code gathers BAreas NO1 through NO4 and adds the QTY and Prices
(edit path to folder in scraper.js to match the folder where you have the CSV files you wish to convert)
Per order and adds them up to get a total, after this the total price is divided by the total QTY to find the price index for the BAreas per hour.
After the data is converted and the equasion has been completed it makes a CSV file and copies the file into the destination folder (found in maths.js) 
Used in node enviroment(This program only allows up to 150 mb CSV files per run.)


## Installing

To install this project

```bash
  npm install
```


## Running program

To run this program

```bash
  node runScripts.js
```
