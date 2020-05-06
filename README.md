# cypress-sample
Sample Cypress project that integrates with qTest Automation Host's Universal Agent. Target audiences of this document are:

- qTest Elite users who are using [Cypress](https://www.cypress.io/) for test automation in their organization and 
- have certain knowdlege of, and experience with, Cypress. In other words, you are Cypress users and are using this framework for test automation and
- want to integrate their Cypress project with qTest Automation Host's Universal Agent and
- want to leverage qTest to schedule and kick off Cypress test execution, either entire tests in their Cypress project or just some selected tests only, then programmatically submit to qTest Manager for visibility and centalizied management

**Notes:** there are extra configurations/hooks needed to be put into the cypress project for [test scheduling](https://documentation.tricentis.com/qtest/od/en/content/qtest_launch/launch_user_guides/schedule_and_kick_off_test_automation_in_qtest_launch.htm) to work in qTest Launch and Universal Agent. When you get this sample up and running properly and want to integrate your actual Cypress project with Universal Agent, make sure you follow the section **Schedule and Kick Off Selected Tests in Cypress** at the end of this document.

## Pre-requitesites
1. [Git](https://git-scm.com/downloads) client installed. To verify if git client is installed properly, open Command Prompt on Windows, or Terminal on Mac, then execute this command `git --version`
2. [NodeJS](https://nodejs.org/en/) 8+ installed. To verify if nodejs is installed properly, open Command Prompt on Windows, or Terminal on Mac, then execute this command `node --version`

## Setup

1. Download sample source code in this repo under cypress-sample-master.zip package and extract them to
    - Windows: `C:\universal-agent-samples\cypress-sample-master`
    - Linux or Mac: `/usr/local/var/cypress-sample-master`
2. Open Terminal (for Mac or Linux), or Command Prompt if you are on Windows
3. Navigate to source code folder
    - Mac or Linux: `cd /usr/local/var/cypress-sample-master`
    - Windows: `cd "C:\universal-agent-samples\cypress-sample-master"`
4. Run this command to install Cypress: `npm install`

## Run Cypress test from command line
This step is to verify you can run Cypress test from command line.

1. Still on Terminal (or Command Prompt) window
2. Enter this command to navigate to source code folder
    1. Mac or Linux: `cd /usr/local/var/cypress-sample-master`
    2. Windows: `cd "C:\universal-agent-samples\cypress-sample-master"`
3. Run this command to execute Cypress test dependent on your Operting System
    - Mac or Linux: `node_modules/.bin/cypress run --browser chrome`
    - Windows: `node_modules\.bin\cypress run --browser chrome`

You should see Cypress is launched and all the tests are executed on Chrome browser. The execution will take some times as Cypress is executing all the specs in this sample so if you don't want to wait for the execution to be finished, simply press `Ctrl + C` to terminate the execution.

4. Now you can delete the sample code folder `cypress-sample-master`

## Integrate Cypress test with Universal Agent
Follow these steps to integrate this Cypress sample test project with Automation Host's Universal Agent.

1. [Download and install qTest Automation Host 2.3.4 or later](https://support.tricentis.com/community/manuals_detail.do?lang=en&version=On-Demand&module=Tricentis%20qTest%20On-Demand&url=qtest_launch/qtest_ahub_2_user_guides/download_qtest_automation_host2.htm)
2. Open web browser and navigate to Automation Host UI at http://localhost:6789 (assuming you installed automation host with  default port, which is 6789. Otherwise, make sure you change the port number 6789 to your port number)
3. Select `+ Add` button to create a new agent.
4. On New Agent dialog, enter the followings:
    - Agent Name: Cypress Universal Agent
    - qTest Manager Project: qConnect Sample Project
    - Agent Type: Universal Agent
    - Pre-Execute Scripts: we will setup Pre-Execute Scripts to clone the source code in this repo to automation host machine (or pull the latest updates if the source code has already existed). 

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
        if not exist "C:\universal-agent-samples\cypress-sample" (
         cd /d D:\
         git clone https://github.com/QASymphony/cypress-sample
        ) else (
         cd /d "C:\universal-agent-samples\cypress-sample"
         git pull --all
        )
        ```
5. Execute Command
    - Executor: select `node`
    - Working Directory: 
        - Mac or Linux: `/usr/local/var/cypress-sample`
        - Windows: `C:\universal-agent-samples\cypress-sample`  
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

        // delete report dir if it exists to make sure we will have latest reports after each execution
        if (fs.existsSync(reportDir)) {
          let deleteCommand = isWin ? `rmdir /s /q "${reportDir}"` : `rm -rf "${reportDir}"`;
          execSync(deleteCommand, { cwd: workingDir, stdio: 'inherit'});
        }

        try {
          let cypressCommand = isWin ? 'node_modules\\.bin\\cypress' : 'node_modules/.bin/cypress';
          let reporterOptions = isWin ? 'mochaFile=reports\\junit-report-[hash].xml,toConsole=true' : 'mochaFile=reports/junit-report-[hash].xml,toConsole=true';
          let testCommand = `${cypressCommand} run --browser chrome --reporter junit --reporter-options "${reporterOptions}"`;
          console.log(`executing testCommand: ${testCommand}`);
          execSync(testCommand, { cwd: workingDir, stdio: 'inherit'});
        } catch (error) {
          console.error('Error executing test: ' + error);
        }
        ```
6. Path to Results: enter path to test result folder that is relative to the source folder
    - Mac or Linux: `/usr/local/var/cypress-sample/reports`
    - Windows: `C:\universal-agent-samples\cypress-sample\reports`
7. Result Parser: select `JUnit for Java (built-in)`

Your agent now looks like below

![Cypress Universal Agent](/docs/cypress-agent.png)

8. Click Save to finish creating the agent. You will be returned back to the Automation Host home page
9. From Agent list, locate the agent **Cypress Universal Agent** you just created. Click on action icon in the last column and select `Run Now`

![Run Agent](/docs/run-now.png)

10. From the run agent dialog, click Execute to execute the agent. When the execution finished, the agent shows the test results are submitted to qTest, as below screenshots.

![Run Agent](/docs/execution-finished.png)

![Run Agent](/docs/test-results.png)

# Universal Agent's Execution Workflow Explained

1. Universal Agent executes **Pre-Execute Scripts** that pulls the latest source code from [this repo](https://github.com/QASymphony/cypress-sample), if the source code is not available in Automation Host machine in the first time, the script will clone the source code into the machine
2. Universal Agent executes the scripts configured in **Execute Command**. Since **node** executor is chosen, the Universal Agent will execute the code against embedded NodeJS bundled with Automation Host. The execution includes:
    - Run `npm install` to install node modules declared in package.json file
    - Delete reports folder if it exists. This is to clean the old results generated from previous execution and make sure this reports folder always contains latest execution results
    - Run Cypress command to execute Cypress test in Chrome browser and generate junit results in the default reports folder. Dependent on the Operating System you are in, this command will be programmatically executed:
        
        **Mac or Linux**
        ```
        node_modules/.bin/cypress run --browser chrome --reporter junit --reporter-options "mochaFile=reports/junit-report-[hash].xml,toConsole=true"
        ```
        **Windows**
        ```
        node_modules\.bin\cypress run --browser chrome --reporter junit --reporter-options "mochaFile=reports\junit-report-[hash].xml,toConsole=true"

        ```
3. When the test execution finished, Universal Agent parses the result in reports folder, which is configured in **Path to Results** field, using the selected **JUnit for Java (built-in)** parser then submits the results as test run logs to qTest Manager.

# Schedule and Kick Off Selected Tests in Cypress

At this point you are able to integrate your Cypress project with Universal Agent and let it
- (i) kicks off your entire tests in Cypress and
- (ii) collects JUnit execution result and
- (iii) submits results to qTest Manager as test run logs

Now let us move on to schedule only some selected test runs in qTest Manager and let Universal Agent kick off the execution for only those scheduled test runs in Cypress.

At the time of this writing, Cypress does not support running a specific test (the **it()** function) inside any spec file but the whole specifc spec file only. Fortunately, Cypress allows us to programmatically **skip** a specific test before it is executed. So what we are going to do in order to schedule and execute only selected tests in Cypress are:

1. In **Execute Command**, we will programmatically instruct the Universal Agent to get the scheduled test runs' automation content from Universal Agent's [magic variable](https://support.tricentis.com/community/manuals_detail.do?lang=en&version=On-Demand&module=Tricentis%20qTest%20On-Demand&url=qtest_launch/universal_agent_user_guides/using_magic_variables_in_universal_agent.htm) naming **$TESTRUNS_LIST**, then pass them to Cypress' execute command via parameter named `--env`. So the command might look something like this:

```
cypress run --env tests="<selected tests to run>"
```

However, in reality, the scheduled test runs can be plenty as qTest user are allowed to schedule unlimited test runs. We will not pass the test runs (with any sort of delimiters) to the Cypress command because we will end up facing the limit for the maximum length of shell/bash command specific to an Operating System. 

The approach is to save the scheduled test runs (again, contained in the **$TESTRUNS_LIST** magic variable) to a json file then pass the file path to Cypress' run command. So the Cypress command will be something like this: 

```
cypress run --env tests="/path/to/testruns_list.json"
```

2. Next, in our Cypress project, we will add code to the plugin (refer to [this documentation](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Plugin-files) for more information on Cypress plugin), which is conventionally located at <path/to/your/project>/cypress/plugin/index.js, for it to loads test runs' automation contents from the file `testruns_list.json`, then push them to the Global object Cypress.env("tests") as an array of test names that we will use later. Below is the code that we will put into cypress/plugin/index.js. **Note:** you do not need to do this as the code has already available in this sample project at [cypress/plugin/index.js](https://github.com/QASymphony/cypress-sample/blob/master/cypress/plugins/index.js)), however, when integrating your actual Cypress project, make sure you put this code into your cypress/plugin/index.js file.

```
// cypress/plugin/index.js
/**
* Add this function to cypress/plugin/index.js
*/
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

  /** add these 2 line of code to read test runs from file */
  readTestRunsFromEnvVar(config);
  return config;
}
```

3. Next, we will also add code to [cypress/support/index.js](https://github.com/QASymphony/cypress-sample/blob/master/cypress/support/index.js) to hooks into **beforeEach()** function (refer to [this documentation](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Support-file for more information on Cypress support file), which will be invoked every time a test is about to be executed in any spec file. What it does are to:
- Check if there are test names from the global Cyptess.env("tests") whose value are an array which is populated in previous step. If there is no test names from Cyptess.env("tests"), execute this test in Cypress. Workflow ends.
- Otherwise, if there are test names from Cyptess.env("tests"), try to match the name of the current executing test with a test name in Cyptess.env("tests"). If there is no matching, **skip the test**

Below code demonstrates this step. Again, the code has already been put into [cypress/support/index.js](https://github.com/QASymphony/cypress-sample/blob/master/cypress/support/index.js) so you do not need to do this. However, when you integrate your actual Cypress project, make sure you put this code into your cypress/support/index.js file.

```
// cypress/support/index.js
beforeEach(function() {
  var getCurrentExecutingTestName = (currentTest) => {
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

  let currentExecutingTestName = getCurrentExecutingTestName(this.currentTest);
  // Obtain test names in --env parameter. Refer to the script cy:run:selected in package.json to know how to sepecify specific tests to run
  // values are either empty if not specified in cypress run command, or and array of test name, like so:
  //    ["<context name> <title 1>","<context name> <describe name> <title 2>","<describe name> <describe name> <title n>", etc. etc.]' 
  let desiredTestNamesToBeRun = Cypress.env("tests");
  cy.log('Cypress.env("tests"): ' + Cypress.env("tests"));
  if (desiredTestNamesToBeRun != undefined && Array.isArray(desiredTestNamesToBeRun)) {
    // since test name list are specified in Cypress.env("tests"), 
    // skip this test if its name is *not* included in the list
    if (!desiredTestNamesToBeRun.includes(currentExecutingTestName)) {
      cy.log(`Skip test '${currentExecutingTestName}' as it's not included in 'tests' env.`);
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

// delete report dir if it exists to make sure we will have a latest reports for every execution
if (fs.existsSync(reportDir)) {
  let deleteCommand = isWin ? `rmdir /s /q "${reportDir}"` : `rm -rf "${reportDir}"`;
  execSync(deleteCommand, { cwd: workingDir, stdio: 'inherit'});
}

let testrunsListFilePath = '';
try {
  /**
   *  Kick off cypress tests. What it does is to check if there are tests being scheduled from qTest Manager by checking the $TESTRUNS_LIST magic variable
   *    1.1. if $TESTRUNS_LIST value is empty: build cypress command that execute all the tests
   *    1.2. if $TESTRUNS_LIST value is NOT empty: save the list into testruns_list.json in the project folder, and rebuild cypress command to specify the test via --env tests="/path/to/testruns_list.json"
   */
  let cypressCommand = isWin ? 'node_modules\\.bin\\cypress' : 'node_modules/.bin/cypress';
  let reporterOptions = isWin ? 'mochaFile=reports\\junit-report-[hash].xml,toConsole=true' : 'mochaFile=reports/junit-report-[hash].xml,toConsole=true';
  let testCommand = `${cypressCommand} run --browser chrome --reporter junit --reporter-options "${reporterOptions}"`;
  if ($TESTRUNS_LIST != undefined && $TESTRUNS_LIST.trim() != null) {
    testrunsListFilePath = path.resolve(process.cwd(), 'testruns_list.json');
    fs.writeFileSync(testrunsListFilePath, $TESTRUNS_LIST);
    testCommand = `${cypressCommand} run --env tests="${testrunsListFilePath}" --browser chrome --reporter junit --reporter-options "${reporterOptions}"`;
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
5. Now go to qTest Manager's Test Execution. Select some test runs that were created from previous Universal Agent execution. Select MORE > SCHEDULE. In this sample, we will select the first 3 test runs in the list, as shown below.

![Select Tests in qTest Manager](/docs/select-tests.png)

6. You will be navigated to qTest Launch. On the **Schedule Test Run: Select Cases** screen, you'll see the 3 test runs you selected in qTest Manager's Test Execution being automatically populated and selected. Enter schedule name and click NEXT.

![Schedule Test](/docs/schedule-tests.png)

7. From **Select Hosts and Agents** screen, select **Cypress Universal Agent** then click **RUN NOW** to schedule and run the test immediately (if you wish you can optionally click on **SET SCHEDULE** button to schedule the test to be run recurrently)

![Select Host and Agent](/docs/select-host-agent.png)

8. Now go back to Automation Host home page. Select **Poll Now** for it to get updates from qTest Launch. This time, the host will receive the job you just scheduled in qTest Launch and execute it. 

![Poll Now](/docs/poll-now.png)

9. Wait for the execution completes then go to qTest Manager's Test Execution to verify that the 3 test runs have been executed in Cypress and their results are submitted. Screenshot below shows the first test run having **Execution History** increased to 2.

![Execution History](/docs/execution-history.png)
