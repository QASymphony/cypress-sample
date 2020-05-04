# cypress-sample
Sample Cypress project that integrates with qTest Automation Host's Universal Agent. 
The specs are cypress samples that are generated by running `cypress open` following these instructions [Gettting Started](https://docs.cypress.io/guides/getting-started/installing-cypress.html).

There also are some extra configurations needed to the cypress projects for test scheduling to work in qTest Launch and Universal Agent against your actual Cypress project. So please make sure you follow the section **Extra steps to integrate your actual Cypress project with Universal Agent** at the end of this document.

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

try {
  let testCommand = `./node_modules/.bin/cypress run --browser chrome --reporter junit --reporter-options='mochaFile=reports/junit-report-[hash].xml,toConsole=true'`;
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

Your agent now looks like below

![Cypress Universal Agent](/docs/cypress-agent.png)

8. Click Save to finish creating the agent. You will be returned back to the Automation Host home page
9. From Agent list, locate the agent **Cypress Universal Agent** you just created. Click on action icon in the last column and select `Run Now`

![Run Agent](/docs/run-now.png)

10. From the run agent dialog, click Execute to execute the agent. When the execution finished, the agent shows the test results are submitted to qTest, as below screenshots.

![Run Agent](/docs/execution-finished.png)

![Run Agent](/docs/test-results.png)

# Universal Agent's execution workflow explained:

1. Executes **Pre-Execute Scripts** to pull the latest source code from this git repo, if the source code is not available in the first time, the script will clone the source code into your automation host machine
2. Universal Agent executes the scripts configured in **Execute Command**. Since **node** executor is chosen, the Universal Agent will execute the code against embedded NodeJS bundled with Automation Host. The execution includes:
- Run `npm install` to install node modules declared in package.json file
- Delete reports folder if it exists. This is to clean the old results generated from previous execution and make sure this reports folder always contains latest execution results
- Run command to execute Cypress test: `./node_modules/.bin/cypress run --browser chrome --reporter junit --reporter-options='mochaFile=reports/junit-report-[hash].xml,toConsole=true'`
3. When the test finished execution, Universal Agent parses the result in reports folder configured in **Path to Results** field using the selected **JUnit for Java (built-in)** parser, then submits the results as test run logs to qTest Manager.

# Schedule and Kick Off selected tests from Cypress project

At this point you are able to integrate your Cypress project with Universal Agent and let it (i) kicks off your entire tests in Cypress, (ii) collects JUnit execution result and (iii) submits them to qTest Manager. Now let us move on to schedule only some selected test runs in qTest Manager and let Universal Agent to kick off the execution for only those scheduled test runs in Cypress.

At the time of this writing, Cypress does not support running a specific test (the **it()** function) inside any spec file but the whole specifc spec file only. However, Cypress allows us to programmatically **skip** a specific test before it is executed. So what we are going to do in order to schedule and execute only selected tests in Cypress are:

1. In Universal Agent's Execute Command, pickups the test runs being scheduled for test execution from the Universal Agent magic variable naming **$TESTRUNS_LIST**, then pass them to Cypress' execute command under parameters named `--env tests='<selected tests to run>'`. Since the scheduled test runs can be plenty (the user are allowed to schedule unlimited test runs in qTest Launch) we cannot pass the test runs as plain text (with some sort of delimiters) to the Cypress command as we will likely encounter the OS length limit for a shell/bash command, the approach is we will save the scheduled test runs to a file and pass the file path to Cypress execute command. So the Cypress command will be something like: `--env tests='/path/to/testruns_list.json'`
2. In Cypress, we will add code to the [plugin](https://docs.cypress.io/guides/tooling/plugins-guide.html#Use-Cases), which is conventionally located at `cypress/plugin/index.js`, to loads the test runs from the file, then push them to the Global object Cypress.env("testnames"), as below:

```
// cypress/plugin/index.js

var readTestRunsFromEnvVar = (config) => {
  // if a testrun list file is specified in the run command via --env tests='<filename>', 
  // read the file to collect desired test names to be executed, and also update the config to contains test names only
  // the values of test names will be use later in support/index.js's beforeEach() function
  // to decide whether or not a test should be skipped
  if (config.env.tests == undefined || config.env.tests.trim() == '') {
    return;
  }

  let testRunsFilePath = config.env.tests.trim();
  try {
    const fs = require('fs');
    if (!fs.existsSync(testRunsFilePath)) {
      console.log(`the file specified via --env tests='${testRunsFilePath}' does not exist.`);
      return;
    }
    
    let htmlDecode = (str) => {
      str = str ? str.trim() : '';
      return str.replace(/\&amp\;/g, '\&').replace(/\&gt\;/g, '\>').replace(
          /\&lt\;/g, '\<').replace(/\&quot\;/g, '\'').replace(/\&\#39\;/g,
          '\'');
    };

    let content = fs.readFileSync(testRunsFilePath, 'utf8');
    let testRunListObject = JSON.parse(content);
    let testNames = [];
    testRunListObject.forEach(testrun => {
      let testcase = testrun.test_case;
      testcase.properties.forEach(prop => {
        if (prop.field_name == 'Automation Content') {
          let automationContent = prop.field_value;
          let index = automationContent.indexOf('#');
          if (index > -1) {
            let testName = htmlDecode(automationContent.substring(index + 1));
            if (testName != '' && !testNames.includes(testName)) {
              testNames.push(testName);
            }
          }
        }
      });
    });
    if (testNames.length > 0) {
      console.log(`There are ${testNames.length} tests specified to be executed --env tests='${testRunsFilePath}'`);
      // this is important in order for Cypress to 'fetch' the updated value of tests env 
      // to Cypress global object and make available during execution
      config.env.tests = testNames;
      return;
    }
  } catch (error) {
    console.log(`error reading test runs at '${testRunsFilePath}: ${error}`);
  } 
}


// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // add these 2 line of code to read test runs from file
  readTestRunsFromEnvVar(config);
  return config;
}
```

3. Next, we will also add code to `cypress/support/index.js` that hooks into **beforeEach()** function, which will be invoked every time a specific test is about to be executed in any spec file. What it does is to:
- Check if there are scheduled test runs to be executed from the global Cyptess.env("testnames") variable whose values is populated in previous step. If there is no test run being scheduled, execute the test in Cypress. Workflow ends.
- Otherwise, if there are test runs to be schedule for execution from the Cyptess.env("testnames"), try to match the name of the test (that is about to be executed) with a test run in Cyptess.env("testnames"). If there is no matching, **skip the test**

Below code demonstrates this step

```
// cypress/support/index.js
beforeEach(function() {
  var getCurrenExecutingtTestName = (currentTest) => {
    let testTitles = [];
    var extractTitles = (obj) => {
      if (obj.hasOwnProperty('parent')) {
        testTitles.push(obj.title.trim());
        let nextObj = obj.parent;
        extractTitles(nextObj);
      }
    }
    extractTitles(currentTest);
    let orderedTitles = testTitles.reverse();
    let testName = orderedTitles.join(' ').trim();
    return testName;
  }

  let currenExecutingtTestName = getCurrenExecutingtTestName(this.currentTest);
  // Obtain test names in --env parameter. Refer to the script cypress:run:selected-tests-only in package.json to know how to sepecify specific tests to run
  // values are either empty if not specified in cypress run command, or and array of test name, like so:
  //    ["<context name> <title 1>","<context name> <describe name> <title 2>","<describe name> <describe name> <title n>", etc. etc.]' 
  let desiredTestNamesToBeRun = Cypress.env("tests");
  cy.log('Cypress.env("tests"): ' + Cypress.env("tests"));
  if (desiredTestNamesToBeRun != undefined && Array.isArray(desiredTestNamesToBeRun)) {
    // if specific test names are specified in cypress run --env tests='[<test names>]' command, 
    // skip this test if its name is *not* included in the test name list
    if (!desiredTestNamesToBeRun.includes(currenExecutingtTestName)) {
      cy.log(`Skip test '${currenExecutingtTestName}' as it's not included in 'tests' env.`);
      cy.state('runnable').ctx.skip();
    }
  }
  else {
    cy.log(`No specific test being specified in cypress run --env command, this test will be run normally.`);
  }
});

```
4. Now go back to our Cypress Universal Agent. Select Edit. Put these updated code to Execute Command:

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
5. Now go to qTest Manager's Test Execution. Select some test runs that were created from previous Universal Execution. Select MORE > SCHEDULE. In this sample, we will select the first 3 test runs in the list, as shown below.

![Select Tests in qTest Manager](/docs/select-tests.png)

6. You will be navigated to qTest Launch. On the **Schedule Test Run: Select Cases** screen, you'll see the 3 test runs you selected in qTest Manager's Test Execution are automatally populated and selected. Enter schedule name and click NEXT.

![Schedule Test](/docs/schedule-tests.png)

7. From **Select Hosts and Agents** screen, select **Cypress Universal Agent** then click **RUN NOW** to schedule and run the test immediately (if you wish you can optionally click on **SET SCHEDULE** button to schedule the test to be run recurrently)

![Select Host and Agent](/docs/select-host-agent.png)

8. Now go back to Automation Host home page. Select **Poll Now** for it to get updates from qTest Launch. This time, the host will receive the job you just scheduled in qTest Launch and execute it. 

![Poll Now](/docs/poll-now.png)

9. Wait for the execution completes then go to qTest Manager's Test Execution to verify that the 3 test runs have been executed in Cypress and their results are submitted. Screenshot below shows the first test run having 2 **Execution History** as well the 

![Execution History](/docs/execution-history.png)
