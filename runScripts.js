const { spawn } = require("child_process");

const scriptsToRun = ["scraper.js", "dataSorter.js", "maths.js"];

function runScripts(index) {
  if (index >= scriptsToRun.length) {
    console.log("All scripts have been executed.");
    return;
  }

  const script = scriptsToRun[index];
  console.log(`Running ${script}...`);

  const childProcess = spawn("node", [script]);

  childProcess.stdout.on("data", (data) => {
    console.log(`stdout from ${script}: ${data}`);
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`stderr from ${script}: ${data}`);
  });

  childProcess.on("exit", (code, signal) => {
    console.log(`Child process ${script} exited with code ${code}`);
    if (code === 0) {
      runScripts(index + 1); // Start the next script
    } else {
      console.error(`Error executing ${script}. Exiting...`);
    }
  });
}

runScripts(0); // Start executing scripts from the beginning
