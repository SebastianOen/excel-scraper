const { spawn } = require("child_process");

// List of JavaScript files to run in succession
const scriptsToRun = [
  "scraper.js",
  "dataSorter.js",
  "maths.js",
  // Add more script paths as needed
];

// Function to run scripts in succession
function runScripts() {
  // Iterate over the list of script paths
  scriptsToRun.forEach((script, index) => {
    console.log(`Running ${script}...`);
    // Spawn a child process to run the script after a delay
    setTimeout(() => {
      const childProcess = spawn("node", [script]);

      // Listen for output from the child process
      childProcess.stdout.on("data", (data) => {
        console.log(`stdout from ${script}: ${data}`);
      });

      // Listen for errors from the child process
      childProcess.stderr.on("data", (data) => {
        console.error(`stderr from ${script}: ${data}`);
      });

      // Listen for when the child process exits
      childProcess.on("exit", (code, signal) => {
        console.log(`Child process ${script} exited with code ${code}`);
      });
    }, index * 3000); // Delay each script execution by 3 seconds
  });
}

// Run the scripts
runScripts();
