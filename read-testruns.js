const fs = require('fs');
const path = require('path');
  

  let testRunsFilePath = path.resolve(process.cwd(), 'testruns_list.json');
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
    } else {
      console.log(`No test names found in --env tests='${testRunsFilePath}'`);
    }
  } catch (error) {
    console.log(`error reading test runs at '${testRunsFilePath}: ${error}`);
  } 
