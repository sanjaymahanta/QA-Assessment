import {
  test as base,
  expect,
  APIRequestContext,
} from '@playwright/test';

import { ApiClient } from '../utils/ApiClient';

type Fixtures = {
  apiClient: ApiClient;
  apiRequest: APIRequestContext;
};

export const test = base.extend<Fixtures>({

  apiRequest: async ({ playwright }, use) => {

    const apiRequest = await playwright.request.newContext({
      baseURL: 'https://conduit-api.bondaracademy.com',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });

    await use(apiRequest);

    await apiRequest.dispose();
  },

  apiClient: async ({ apiRequest }, use) => {

    const apiClient = new ApiClient(apiRequest);

    await use(apiClient);
  },
});

export { expect };