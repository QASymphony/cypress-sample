const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const isWin = process.platform == "win32";
const workingDir = process.cwd();
const reportDirName = 'reports';
const reportDir = path.resolve(workingDir, reportDirName);

// install node module with below command
execSync('npm install && npm run delete:reports', {
  cwd: workingDir,
  stdio: 'inherit'
});

let testrunsListFilePath = "";
try {
    var $TESTRUNS_LIST = `[
      {
        "parentId": 4952359,
        "parentType": "test-suite",
        "automation": "Yes",
        "links": [
          {
            "rel": "test-case",
            "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-cases/40577398?versionId=58832885&showParamIdentifier=false"
          },
          {
            "rel": "test-suite",
            "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-suites/4952359"
          },
          {
            "rel": "self",
            "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-runs/158579162"
          }
        ],
        "id": 158579162,
        "name": "cy.go() - go back or forward in the browser's history#Navigation cy.go() - go back or forward in the browser's history",
        "order": 87,
        "pid": "TR-2217",
        "created_date": "2020-05-01T23:47:54+07:00",
        "last_modified_date": "2020-05-01T23:47:54+07:00",
        "properties": [
          {
            "field_id": 6964386,
            "field_name": "Run Order",
            "field_value": "87"
          },
          {
            "field_id": 6964392,
            "field_name": "Planned Time",
            "field_value": "0"
          },
          {
            "field_id": -117,
            "field_name": "Total Planned Time",
            "field_value": "0"
          },
          {
            "field_id": 6964393,
            "field_name": "Actual Time",
            "field_value": "0"
          },
          {
            "field_id": -112,
            "field_name": "Total Actual Time",
            "field_value": "0"
          },
          {
            "field_id": -106,
            "field_name": "Average Execution Time",
            "field_value": "0"
          },
          {
            "field_id": 6902134,
            "field_name": "Execution Type",
            "field_value": "501",
            "field_value_name": "Functional"
          },
          {
            "field_id": 6902135,
            "field_name": "Planned Start Date",
            "field_value": "2019-04-23T00:00:00+00:00"
          },
          {
            "field_id": 6902136,
            "field_name": "Environment",
            "field_value": "",
            "field_value_name": ""
          },
          {
            "field_id": 6902137,
            "field_name": "Planned End Date",
            "field_value": "2019-04-23T00:00:00+00:00"
          },
          {
            "field_id": 6902139,
            "field_name": "Target Release/Build",
            "field_value": "",
            "field_value_name": ""
          },
          {
            "field_id": 6902129,
            "field_name": "Assigned To",
            "field_value": "8931",
            "field_value_name": "Huy Nguyen"
          },
          {
            "field_id": 6902143,
            "field_name": "Status",
            "field_value": "601",
            "field_value_name": "Passed"
          },
          {
            "field_id": 6902141,
            "field_name": "Priority",
            "field_value": "723",
            "field_value_name": "Medium"
          },
          {
            "field_id": 6964378,
            "field_name": "Build Number",
            "field_value": ""
          },
          {
            "field_id": 6964380,
            "field_name": "CI Tool",
            "field_value": "",
            "field_value_name": ""
          },
          {
            "field_id": 6964379,
            "field_name": "Build URL",
            "field_value": ""
          }
        ],
        "test_case": {
          "links": [
            {
              "rel": "attachments",
              "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-cases/40577398/attachments"
            },
            {
              "rel": "self",
              "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-cases/40577398"
            },
            {
              "rel": "test-steps",
              "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-cases/40577398/versions/58832885/test-steps?expand=&showParamIdentifier=false"
            },
            {
              "rel": "attachments",
              "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-cases/40577398/attachments"
            }
          ],
          "id": 40577398,
          "name": "cy.go() - go back or forward in the browser's history#Navigation cy.go() - go back or forward in the browser's history",
          "order": 68,
          "pid": "TC-616",
          "created_date": "2020-04-29T01:16:56+07:00",
          "last_modified_date": "2020-04-29T01:16:56+07:00",
          "properties": [
            {
              "field_id": 6902118,
              "field_name": "Automation",
              "field_value": "711",
              "field_value_name": "Yes"
            },
            {
              "field_id": 6902119,
              "field_name": "Automation Content",
              "field_value": "cy.go() - go back or forward in the browser's history#Navigation cy.go() - go back or forward in the browser's history"
            },
            {
              "field_id": 6902121,
              "field_name": "Status",
              "field_value": "201",
              "field_value_name": "New"
            },
            {
              "field_id": 6902122,
              "field_name": "Type",
              "field_value": "702",
              "field_value_name": "Automation"
            },
            {
              "field_id": 6902114,
              "field_name": "Assigned To",
              "field_value": "",
              "field_value_name": ""
            },
            {
              "field_id": 6902124,
              "field_name": "Description",
              "field_value": ""
            },
            {
              "field_id": 6902125,
              "field_name": "Precondition",
              "field_value": ""
            },
            {
              "field_id": 6902126,
              "field_name": "Priority",
              "field_value": "723",
              "field_value_name": "Medium"
            },
            {
              "field_id": 9525078,
              "field_name": "Tuan Test",
              "field_value": "tuan test"
            },
            {
              "field_id": 9525079,
              "field_name": "New Value",
              "field_value": "",
              "field_value_name": ""
            }
          ],
          "web_url": "https://qas.qtestnet.com/p/91096/portal/project#tab=testdesign&object=1&id=40577398",
          "test_steps": [
            {
              "links": [
                {
                  "rel": "self",
                  "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-cases/40577398/test-steps/420890968"
                },
                {
                  "rel": "attachments",
                  "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-steps/420890968/attachments"
                }
              ],
              "id": 420890968,
              "description": "Navigation cy.go() - go back or forward in the browser's history",
              "expected": "Navigation cy.go() - go back or forward in the browser's history",
              "order": 1,
              "attachments": [],
              "group": 1,
              "information": {
                "description": null,
                "descriptionInfo": {
                  "parameters": [],
                  "rawText": "Navigation cy.go() - go back or forward in the browser's history",
                  "plainValueText": "Navigation cy.go() - go back or forward in the browser's history",
                  "editedParameters": [],
                  "valueText": "Navigation cy.go() - go back or forward in the browser's history",
                  "htmlText": "Navigation cy.go() - go back or forward in the browser&#39;s history",
                  "plainText": "Navigation cy.go() - go back or forward in the browser's history"
                },
                "expectedResult": null,
                "actualResult": null
              },
              "plain_value_text": "Navigation cy.go() - go back or forward in the browser's history",
              "parameter_values": []
            }
          ],
          "parent_id": 8346717,
          "test_case_version_id": 58832885,
          "version": "1.0",
          "description": "",
          "precondition": "",
          "creator_id": 8931,
          "agent_ids": []
        },
        "test_case_version_id": 58832885,
        "test_case_version": "1.0",
        "creator_id": 8931
      },
      {
        "parentId": 4952359,
        "parentType": "test-suite",
        "automation": "Yes",
        "links": [
          {
            "rel": "test-case",
            "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-cases/40577414?versionId=58832901&showParamIdentifier=false"
          },
          {
            "rel": "test-suite",
            "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-suites/4952359"
          },
          {
            "rel": "self",
            "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-runs/158579171"
          }
        ],
        "id": 158579171,
        "name": "cy.spy() - wrap a method in a spy#Spies, Stubs, and Clock cy.spy() - wrap a method in a spy",
        "order": 96,
        "pid": "TR-2226",
        "created_date": "2020-05-01T23:47:54+07:00",
        "last_modified_date": "2020-05-01T23:47:54+07:00",
        "properties": [
          {
            "field_id": 6964386,
            "field_name": "Run Order",
            "field_value": "96"
          },
          {
            "field_id": 6964392,
            "field_name": "Planned Time",
            "field_value": "0"
          },
          {
            "field_id": -117,
            "field_name": "Total Planned Time",
            "field_value": "0"
          },
          {
            "field_id": 6964393,
            "field_name": "Actual Time",
            "field_value": "0"
          },
          {
            "field_id": -112,
            "field_name": "Total Actual Time",
            "field_value": "0"
          },
          {
            "field_id": -106,
            "field_name": "Average Execution Time",
            "field_value": "0"
          },
          {
            "field_id": 6902134,
            "field_name": "Execution Type",
            "field_value": "501",
            "field_value_name": "Functional"
          },
          {
            "field_id": 6902135,
            "field_name": "Planned Start Date",
            "field_value": "2019-04-23T00:00:00+00:00"
          },
          {
            "field_id": 6902136,
            "field_name": "Environment",
            "field_value": "",
            "field_value_name": ""
          },
          {
            "field_id": 6902137,
            "field_name": "Planned End Date",
            "field_value": "2019-04-23T00:00:00+00:00"
          },
          {
            "field_id": 6902139,
            "field_name": "Target Release/Build",
            "field_value": "",
            "field_value_name": ""
          },
          {
            "field_id": 6902129,
            "field_name": "Assigned To",
            "field_value": "8931",
            "field_value_name": "Huy Nguyen"
          },
          {
            "field_id": 6902143,
            "field_name": "Status",
            "field_value": "601",
            "field_value_name": "Passed"
          },
          {
            "field_id": 6902141,
            "field_name": "Priority",
            "field_value": "723",
            "field_value_name": "Medium"
          },
          {
            "field_id": 6964378,
            "field_name": "Build Number",
            "field_value": ""
          },
          {
            "field_id": 6964380,
            "field_name": "CI Tool",
            "field_value": "",
            "field_value_name": ""
          },
          {
            "field_id": 6964379,
            "field_name": "Build URL",
            "field_value": ""
          }
        ],
        "test_case": {
          "links": [
            {
              "rel": "attachments",
              "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-cases/40577414/attachments"
            },
            {
              "rel": "self",
              "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-cases/40577414"
            },
            {
              "rel": "test-steps",
              "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-cases/40577414/versions/58832901/test-steps?expand=&showParamIdentifier=false"
            },
            {
              "rel": "attachments",
              "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-cases/40577414/attachments"
            }
          ],
          "id": 40577414,
          "name": "cy.spy() - wrap a method in a spy#Spies, Stubs, and Clock cy.spy() - wrap a method in a spy",
          "order": 84,
          "pid": "TC-632",
          "created_date": "2020-04-29T01:16:56+07:00",
          "last_modified_date": "2020-04-29T01:16:56+07:00",
          "properties": [
            {
              "field_id": 6902118,
              "field_name": "Automation",
              "field_value": "711",
              "field_value_name": "Yes"
            },
            {
              "field_id": 6902119,
              "field_name": "Automation Content",
              "field_value": "cy.spy() - wrap a method in a spy#Spies, Stubs, and Clock cy.spy() - wrap a method in a spy"
            },
            {
              "field_id": 6902121,
              "field_name": "Status",
              "field_value": "201",
              "field_value_name": "New"
            },
            {
              "field_id": 6902122,
              "field_name": "Type",
              "field_value": "702",
              "field_value_name": "Automation"
            },
            {
              "field_id": 6902114,
              "field_name": "Assigned To",
              "field_value": "",
              "field_value_name": ""
            },
            {
              "field_id": 6902124,
              "field_name": "Description",
              "field_value": ""
            },
            {
              "field_id": 6902125,
              "field_name": "Precondition",
              "field_value": ""
            },
            {
              "field_id": 6902126,
              "field_name": "Priority",
              "field_value": "723",
              "field_value_name": "Medium"
            },
            {
              "field_id": 9525078,
              "field_name": "Tuan Test",
              "field_value": "tuan test"
            },
            {
              "field_id": 9525079,
              "field_name": "New Value",
              "field_value": "",
              "field_value_name": ""
            }
          ],
          "web_url": "https://qas.qtestnet.com/p/91096/portal/project#tab=testdesign&object=1&id=40577414",
          "test_steps": [
            {
              "links": [
                {
                  "rel": "self",
                  "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-cases/40577414/test-steps/420890984"
                },
                {
                  "rel": "attachments",
                  "href": "https://qas.qtestnet.com/api/v3/projects/91096/test-steps/420890984/attachments"
                }
              ],
              "id": 420890984,
              "description": "Spies, Stubs, and Clock cy.spy() - wrap a method in a spy",
              "expected": "Spies, Stubs, and Clock cy.spy() - wrap a method in a spy",
              "order": 1,
              "attachments": [],
              "group": 1,
              "information": {
                "description": null,
                "descriptionInfo": {
                  "parameters": [],
                  "rawText": "Spies, Stubs, and Clock cy.spy() - wrap a method in a spy",
                  "plainValueText": "Spies, Stubs, and Clock cy.spy() - wrap a method in a spy",
                  "editedParameters": [],
                  "valueText": "Spies, Stubs, and Clock cy.spy() - wrap a method in a spy",
                  "htmlText": "Spies, Stubs, and Clock cy.spy() - wrap a method in a spy",
                  "plainText": "Spies, Stubs, and Clock cy.spy() - wrap a method in a spy"
                },
                "expectedResult": null,
                "actualResult": null
              },
              "plain_value_text": "Spies, Stubs, and Clock cy.spy() - wrap a method in a spy",
              "parameter_values": []
            }
          ],
          "parent_id": 8346717,
          "test_case_version_id": 58832901,
          "version": "1.0",
          "description": "",
          "precondition": "",
          "creator_id": 8931,
          "agent_ids": []
        },
        "test_case_version_id": 58832901,
        "test_case_version": "1.0",
        "creator_id": 8931
      }
    ]`;
 
  /**
   *  Kick off cypress tests. What it does is to check if there are tests being scheduled from qTest Manager by checking the $TESTRUNS_LIST magic variable
   *    1.1. if $TESTRUNS_LIST value is empty: build execute command that execute all the tests
   *    1.2. if $TESTRUNS_LIST value is NOT empty: obtains test names in $TESTRUNS_LIST then build execute command that execute those tests only
  */

  let cypressCommand = isWin ? 'node_modules\.bin\cypress' : 'node_modules/.bin/cypress';
  let reporterOptions = isWin ? 'reports\junit-report-[hash].xml' : 'reports/junit-report-[hash].xml';
  let testCommand = `${cypressCommand} run --browser chrome --reporter junit --reporter-options "mochaFile=${reporterOptions},toConsole=true"`;
  if ($TESTRUNS_LIST != undefined && $TESTRUNS_LIST.trim() != null) {
    testrunsListFilePath = path.resolve(workingDir, 'testruns_list.json');
    fs.writeFileSync(testrunsListFilePath, $TESTRUNS_LIST);
    testCommand = `${cypressCommand} run --env tests='${testrunsListFilePath}' --browser chrome --reporter junit --reporter-options "mochaFile=${reporterOptions},toConsole=true"`;
  }

  console.log(`executing testCommand: ${testCommand}`);
  execSync(testCommand, {
    cwd: process.cwd(),
    stdio: 'inherit'
  });
} catch(error) {
	console.error('Error executing test: ' + error);
} finally {
  if (testrunsListFilePath != "" && fs.existsSync(testrunsListFilePath)) {
    fs.unlinkSync(testrunsListFilePath);
  }
}