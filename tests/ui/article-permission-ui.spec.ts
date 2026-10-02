import { test, expect } from '../fixtures/test-fixtures';
import {
  createTestUser,
  createTestArticle,
} from '../test-data/testData';

test(
  'Non-owner cannot edit or delete another user article through UI',
  async ({ page, apiClient }) => {

    const userA = createTestUser();
    const article = createTestArticle();

    // --------------------------------
    // CREATE USER A
    // --------------------------------

    const userAResponse = await apiClient.registerUser(
      userA.username,
      userA.email,
      userA.password
    );

    const tokenA = userAResponse.user.token;

    // --------------------------------
    // USER A CREATES ARTICLE
    // --------------------------------

    const createResponse = await apiClient.createArticle(
      tokenA,
      article.title,
      article.description,
      article.body
    );

    const articleSlug = createResponse.article.slug;

    // --------------------------------
    // CREATE USER B
    // --------------------------------

    const userB = createTestUser();

    userB.username = `${userB.username}b`;
    userB.email = userB.email.replace('@', 'b@');

    const userBResponse = await apiClient.registerUser(
      userB.username,
      userB.email,
      userB.password
    );

    const tokenB = userBResponse.user.token;

    // --------------------------------
    // LOGIN USER B THROUGH UI
    // --------------------------------

    await page.goto('/login');

    await page.getByPlaceholder('Email').fill(
      userB.email
    );

    await page.getByPlaceholder('Password').fill(
      userB.password
    );

    await page.getByRole('button', {
      name: 'Sign in',
    }).click();

    // --------------------------------
    // OPEN USER A ARTICLE
    // --------------------------------

    await page.goto(`/article/${articleSlug}`);

    // Verify article heading is visible
    await expect(
      page.getByRole('heading', {
        name: article.title,
      })
    ).toBeVisible();

    // --------------------------------
    // VERIFY NON-OWNER CONTROLS
    // --------------------------------

    await expect(
      page.getByRole('link', {
        name: 'Edit Article',
      })
    ).not.toBeVisible();

    await expect(
      page.getByRole('button', {
        name: 'Delete Article',
      })
    ).not.toBeVisible();

    // --------------------------------
    // VERIFY ARTICLE STILL EXISTS
    // --------------------------------

    const verifyResponse = await apiClient.getArticle(
      tokenA,
      articleSlug
    );

    expect(verifyResponse.status()).toBe(200);
  }
);