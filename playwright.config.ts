import { defineConfig, devices } from '@playwright/test';
import { testOptions } from './test-options';

require('dotenv').config();

export default defineConfig<testOptions>({
  timeout: 60000, // 10 seconds (he modificado el tiempo de espera en las solicitudes)
  globalTimeout: 60000, // 60 seconds
  expect:{
    timeout:2000
  },
  
  retries: 1,
  reporter: [
    //['json', {outputFile: 'test-results/jsonReport.json'}],
    //['junit', {outputFile: 'test-results/junitReport.xml'}],
    ['html']
  ],

  use: {
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL:process.env.DEV ==='1' ? 'http://localhost:4201/'
          : process.env.STAGING == '1' ? 'http://localhost:4202/'
          : 'http://localhost:4200/',
    trace: 'on-first-retry',
    actionTimeout: 20000,
    navigationTimeout: 25000,
    video:{
      mode: 'off',
      size:{width:1920, height:1080}
    }
  },

  projects: [
    {
      name: 'dev',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200/'
      },
    },
    {
      name: 'chromium',
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox'
      },
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 13 Pro']
      }
    }
  ],
});
