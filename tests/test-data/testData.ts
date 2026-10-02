export interface TestUser {
  username: string;
  email: string;
  password: string;
}

export interface TestArticle {
  title: string;
  description: string;
  body: string;
  updatedTitle: string;
  updatedDescription: string;
  updatedBody: string;
}

export function createTestUser(): TestUser {
  const uniqueId = Date.now().toString().slice(-8);

  return {
    username: `qa${uniqueId}`,
    email: `qa${uniqueId}@gmail.com`,
    password: 'Test@123456',
  };
}

export function createTestArticle(): TestArticle {
  const uniqueId = Date.now().toString().slice(-8);

  return {
    title: `QA Article ${uniqueId}`,
    description: 'Article created using Playwright automation',
    body: 'This article was created using Playwright automation.',

    updatedTitle: `Updated QA Article ${uniqueId}`,
    updatedDescription: 'Updated article description',
    updatedBody: 'This article was updated using Playwright automation.',
  };
}