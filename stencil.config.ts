import { Config } from '@stencil/core';

// https://stenciljs.com/docs/config

export const config: Config = {
  globalStyle: 'src/global/app.css',
  globalScript: 'src/global/app.ts',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: {
        swSrc: './src/sw.js'
      },
      baseUrl: 'https://podcast-gdp.web.app/'
    }
  ]
};
