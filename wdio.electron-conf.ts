import type { Options } from '@wdio/types';
import { config as baseConfig } from './base.conf.ts';
import { t2_1TeamsPath } from './helpers/constants.ts';
import {exec} from 'child_process';

const electronConf = {
  specs: [
    './test/specs/**/*.ts'
  ],

  maxInstances: 1,
  // services: ['electron'],
  capabilities: [{
    browserName: 'msedge',
    "ms:edgeOptions": {
      debuggerAddress: "127.0.0.1:9222"
    },
  }],
  onWorkerStart: async function (cid, caps, specs, args, execArgv) {
    console.log(`********* Launching MS Teams App ${t2_1TeamsPath} *********************`)
    const command = `${t2_1TeamsPath} --remote-debugging-port=9222`;
    console.log(command);
    await exec(command);
    console.log("********* Finished Launching Teams App ***************")
  },
  onWorkerEnd: async function() {
    const killTeamsCMD = `powershell -C "Get-Process -Name '*teams*' | Stop-Process -Force"`;
    await exec(killTeamsCMD);
    // await sleep(10);
  }
}


export const config: WebdriverIO.Config = { ...baseConfig, ...electronConf }