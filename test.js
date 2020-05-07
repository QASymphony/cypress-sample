const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const isWin = process.platform == "win32";
const workingDir = process.cwd();
const reportDirName = 'reports';

// install node module with below command
execSync('npm install && npm run delete:reports', {
  cwd: workingDir,
  stdio: 'inherit'
});

try {
  let testCommand = isWin 
    ? `node_modules\\.bin\\cypress run --browser chrome --reporter junit --reporter-options="mochaFile=reports\\junit-report-[hash].xml,toConsole=true"`
    : `./node_modules/.bin/cypress run --browser chrome --reporter junit --reporter-options='mochaFile=reports/junit-report-[hash].xml,toConsole=true'`;  
  console.log(`executing testCommand: ${testCommand}`);
  execSync(testCommand, {
    cwd: process.cwd(),
    stdio: 'inherit'
  });
} catch(error) {
	console.error('Error executing test: ' + error);
}