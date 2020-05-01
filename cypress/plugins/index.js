/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************


var readTestRunsFromEnvVar = (config) => {
  // if a testrun list file is specified in the run command via --env tests='<filename>', 
  // read the file to collect desired test names to be executed, and also update the config to contains test names only
  // the values of test names will be use later in support/index.js's beforeEach() function
  // to decide whether or not a test should be skipped
  if (config.env.tests == undefined) {
    return;
  }
  let testRunsFilePath = config.env.tests;
  try {
    const fs = require('fs');
    if (!fs.existsSync(testRunsFilePath)) {
      console.log(`the file specified via --env tests='${testRunsFilePath}' does not exist.`);
      return;
    }
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
            let testName = automationContent.substring(index + 1);
            if (!testNames.includes(testName)) {
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
      return config;
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
  
  return readTestRunsFromEnvVar(config);
}
