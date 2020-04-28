const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const isWin = process.platform == "win32";
const workingDir = process.cwd();
const reportDir = path.resolve(workingDir, 'reports');

if (fs.existsSync(reportDir)) {
  let deleteCommand = isWin ? `rmdir /s /q "${reportDir}"` : `rm -rf "${reportDir}"`;
  execSync(deleteCommand, { 
    cwd: workingDir, 
    stdio: 'inherit' 
  });
}