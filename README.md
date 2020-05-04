# cypress-sample
Sample Cypress project that integrates with qTest Automation Host's Universal Agent. 
The specs are cypress samples that are generated after running `cypress open` following these instructions [Gettting Started](https://docs.cypress.io/guides/getting-started/installing-cypress.html)

## Pre-requitesites
1. Git
2. NodeJS 8+

## Setup
1. Open Terminal (for Mac or Linux), or Command Prompt if you are on Windows
2. Navigate to source code folder
    1. Mac or Linux: `cd /usr/local/var/cypress-sample`
    2. Windows: `cd "D:\cypress-sample"`
3. Run this command to install Cypress: `npm install`

## Run Cypress test from command line
This step is to verify you can run Cypress test from command line.

1. Still on Terminal (or Command Prompt) window2. 
2. Enter this command to navigate to source code folder
    1. Mac or Linux: `cd /usr/local/var/cypress-sample`
    2. Windows: `cd "D:\cypress-sample"`
3. Run this command to execute Protractor test `npm run cy:run`. (Refer to package.json for detail information regarding this npm script)

You should see Cypress is launched and all the tests are executed afterward.

## Integrate Cypress test with Universal Agent
Follow these steps to integrate this Cypress sample test project with Automation Host's Universal Agent.

1. [Download and install qTest Automation Host](https://support.tricentis.com/community/manuals_detail.do?lang=en&version=On-Demand&module=Tricentis%20qTest%20On-Demand&url=qtest_launch/qtest_ahub_2_user_guides/download_qtest_automation_host2.htm)
2. Open web browser and navigate to Automation Host UI at http://localhost:6789 (assuming you installed automation host in the default port, which is 6789. Otherwise, make sure you change the port number 6789 to your desired port number.
3. Select `+ Add` button to create a new agent.
4. On New Agent dialog, enter the followings:
- Agent Name: Cypress Universal Agent
- qTest Manager Project: qConnect Sample Project
- Agent Type: Universal Agent
- Pre-Execute Scripts: enter the following script dependent on your Operating System

**Mac**
```
#!/bin/bash
if [ ! -d "/usr/local/var/cypress-sample" ]
then
  cd "/usr/local/var"
  git clone git@github.com:QASymphony/cypress-sample.git
else
  cd /usr/local/var/cypress-sample
  git pull --all
fi
```
**Windows**
```
if not exist "D:\cypress-sample" (
 cd /d D:\
 git clone https://github.com/QASymphony/cypress-sample
) else (
 cd /d "D:\cypress-sample"
 git pull --all
)
```
5. Execute Command
- Executor: select `node`
- Working Directory: 
    1. Mac or Linux: `/usr/local/var/cypress-sample`
    2. Windows: `D:\cypress-sample`  
- Enter the scripts below to the code area of Execute Command

```
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const isWin = process.platform == 'win32';
const workingDir = process.env.WORKING_DIR;
const reportDirName = 'reports';
const reportDir = path.resolve(workingDir, reportDirName);

// install node module with below command
execSync('npm install', { cwd: workingDir, stdio: 'inherit'});

// delete report dir if it exists to make sure we will have a latest reports after execution
if (fs.existsSync(reportDir)) {
  let deleteCommand = isWin ? `rmdir /s /q "${reportDir}"` : `rm -rf "${reportDir}"`;
  execSync(deleteCommand, { cwd: workingDir, stdio: 'inherit'});
}

let testrunsListFilePath = '';
try {
  /**
   *  Kick off cypress tests. What it does is to check if there are tests being scheduled from qTest Manager by checking the $TESTCASES_AC magic variable
   *    1.1. if $TESTRUNS_LIST value is empty: build cypress execute command that execute all the tests
   *    1.2. if $TESTRUNS_LIST value is NOT empty: save the list into testruns_list.json in the project folder, and rebuild cypress execute command to specify it
   */
  let testCommand = `./node_modules/.bin/cypress run --browser chrome --reporter junit --reporter-options='mochaFile=reports/junit-report-[hash].xml,toConsole=true'`;
  if ($TESTRUNS_LIST != undefined && $TESTRUNS_LIST.trim() != null) {
    testrunsListFilePath = path.resolve(process.cwd(), 'testruns_list.json');
    fs.writeFileSync(testrunsListFilePath, $TESTRUNS_LIST);
    testCommand = `./node_modules/.bin/cypress run --env tests='${testrunsListFilePath}' --browser chrome --reporter junit --reporter-options='mochaFile=reports/junit-report-[hash].xml,toConsole=true'`;

  }
  console.log(`executing testCommand: ${testCommand}`);
  execSync(testCommand, { cwd: workingDir, stdio: 'inherit'});
} catch (error) {
  console.error('Error executing test: ' + error);
} finally {
  if (testrunsListFilePath != "" && fs.existsSync(testrunsListFilePath)) {
    fs.unlinkSync(testrunsListFilePath);
  }
}
```
6. Path to Results: enter path to test result folder that is relative to the source folder
- Mac: enter `/usr/local/var/cypress-sample/reports`
- Windows: enter `D:\cypress-sample\reports`
7. Result Parser: select `JUnit for Java (built-in)`

Your agent now look like below

![Cypress Universal Agent](/docs/cypress-agent.png)

8. Click Save to finish creating the agent. You will be returned back to the Automation Host home page
9. From Agent list, locate the agent **Cypress Universal Agent** you just created. Click on action icon in the last column and select `Run Now`
10. From the run agent dialog, click Execute to execute the agent.

![Run Agent](/docs/run-now.png)

11. When the execution finished, the agent show the test results are submitted to qTest, as below screenshots.

![Run Agent](/docs/execution-finished.png)

![Run Agent](/docs/test-results.png)
