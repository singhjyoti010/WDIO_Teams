import { specConstant } from './helpers/constants.ts';
import { LoginHelper } from './helpers/pagemodels/common/login-helper.ts';
import {ReportAggregator} from 'wdio-html-nice-reporter';
import {exec} from 'child_process';
import {config as readDotEnv} from 'dotenv';
readDotEnv();
import * as path from 'path';
import moment from 'moment';

// wdio.config.ts

let reportAggregator: ReportAggregator;

const loginHelper = new LoginHelper();

export let currentTCID: string;

export const config : WebdriverIO.Config= {
    runner: 'local',
    autoCompileOpts: {
        tsNodeOpts: {
            project: './tsconfig.json'
        }
    },

    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    

    maxInstances: 1,

    //number of times to retry the failed specs
    specFileRetries: 2,

    logLevel: 'info',

    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    baseUrl: 'https://teams.microsoft.com',

    // Default timeout for all waitFor* commands.
    waitforTimeout: 10000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,
    //
    // Default request retries count
    connectionRetryCount: 3,

    framework: 'mocha',

    onWorkerStart: function (specs) {
        const index = specs[0].lastIndexOf('/');
        process.env.SPECS_NAME = specs[0].substring(index + 1);
        console.log(process.env.SPECS_NAME)
    },

    reporters: ['spec',["html-nice", {
            debug: false,
            outputDir: './reports/html-reports/',
            filename: 'report.html',
            reportTitle: 'BIM Test Automation Report',
            showInBrowser: false,
            useOnAfterCommandForScreenshot: true,
            linkScreenshots: true
        }],
        [
            'junit',
            {
                outputDir: './reports/test-results',
                outputFileFormat: function(options) { // optional
                    return `wdio-${options.cid}-junit-.xml`
                }
            }],
    ],

    beforeSuite: async function (suite) {
        //Add any setup code you want to execute once for each test files here
        await browser.pause(4000); // Introduce a 4-second delay before each test
    },

    onPrepare: async function(config, capabilities) {

        reportAggregator = new ReportAggregator({
           outputDir: './reports/html-reports',
           filename: 'BIM-MasterReport.html',
           reportTitle: `BIM Test Automation Report - ${process.env.PLATFORMNAME}`,
           browserName: process.env.PLATFORMNAME === 'WEB' ? 'Google Chrome' : 'EdgeWebView',
           collapseTests: false,
        });
        reportAggregator.clean();
    },


    before: async function(capabilities,specs,browser){
        await loginHelper.login(specConstant.userEmail, specConstant.userPass);
        await browser.setTimeout({
            pageLoad: 30000,
        })
    },

    afterTest: async function(test,context,result){
        if(result.passed){
            return;
        }
        else {
            const timestamp=moment().format('YYYYMMDD-HHmmss.SSS');
            const filepath = path.join('reports/html-reports/screenshots/', timestamp + '.png');
            await browser.saveScreenshot(filepath);
        }
    },

    mochaOpts: {
        ui: 'bdd',
        timeout: 300000,
        bail: false,
        grep: process.env.PLATFORMNAME === 'WEB' ? /\[PartiallyWeb\]|\[Desktop\]/ : /\[PartiallyDesktop\]/,
        invert: true
    },

    capabilities: [],

    onComplete: async function() {
            
            (async () => {
                await reportAggregator.createReport();
                const cmd=`powershell -C "Compress-Archive -Path './reports/html-reports/BIM-MasterReport.html','./reports/html-reports/BIM-MasterReport.json','./reports/html-reports/report-styles.css','./reports/html-reports/glyphicons-halflings-regular.woff' -DestinationPath ./reports/BIM-TestResults.zip;Remove-Item ./reports/html-reports -Recurse -Force"`;
                await exec(cmd);
        })();
    },
}