// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

/** 
 * Global before hook that runs before every single test is being executed. What it does: 
 * - Checks whether specific test name (or names) are specified in `cypress run --env tests='<array of test names>'` command
 * - If there is/are test name(s) specified, skip the current test if its name is not included in the test name list
 * - If there is no test name specified in --env, the test will be run normally
*/
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