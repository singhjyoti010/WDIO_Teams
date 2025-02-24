import type { Options } from '@wdio/types';
import { config as baseConfig } from './base.conf.ts';

const localWebConfig = {
    specs: [
        './test/specs/**/*.ts',
    ],

    capabilities: [{
        browserName: 'chrome',
    }],
}

const lconfig:Options.Testrunner = {...baseConfig , ...localWebConfig}

export const config=lconfig;

