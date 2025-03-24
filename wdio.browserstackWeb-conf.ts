import type { Options } from '@wdio/types';
import {config as readDotEnv } from 'dotenv';
readDotEnv();
import { config as baseConfig } from './base.conf.ts'

const dateObj = new Date();
const currentDate = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;

const browserstackWebConfig = {
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    specs: [
        './test/specs/**/3783839.ts'
    ],
    
    exclude: [
        './test/specs/Zoom/*.ts',
        './test/specs/**/3792053.ts',
        './test/specs/**/3792054.ts'
    ],

    services: ['browserstack'],

    maxInstances: 5,

    capabilities: [
        {
            "browserName" : "chrome",
            "browserVersion" : "latest",
            'bstack:options' : {
                "buildName": `BIM Web Tests - ${currentDate}`,
                "projectName": 'MS Teams BIM Automation',
                "os" : "Windows",
                "osVersion" : "11",
            },
    }]
}

export const config : Options.Testrunner = {...baseConfig , ...browserstackWebConfig}