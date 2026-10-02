import { test, expect } from '../fixtures/test-fixtures';
import {
  createTestUser,
  createTestArticle,
} from '../test-data/testData';

test('Non-owner cannot edit or delete another user article', async ({
  apiClient,
}) => {

  // --------------------------------
  // CREATE USER A
  // --------------------------------

  const userA = createTestUser();
  const article = createTestArticle();

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

  expect(createResponse.article.author.username).toBe(
    userA.username
  );

  const articleSlug = createResponse.article.slug;

  // --------------------------------
  // CREATE USER B
  // --------------------------------

  const userB = createTestUser();

  // Make username/email different from User A
  userB.username = `${userB.username}b`;
  userB.email = userB.email.replace('@', 'b@');

  const userBResponse = await apiClient.registerUser(
    userB.username,
    userB.email,
    userB.password
  );

  const tokenB = userBResponse.user.token;

  // --------------------------------
  // USER B ATTEMPTS UPDATE
  // --------------------------------

  const updateResponse = await apiClient.updateArticle(
    tokenB,
    articleSlug,
    article.updatedTitle,
    article.updatedDescription,
    article.updatedBody
  );

  expect(updateResponse.status()).toBe(403);

  // --------------------------------
  // USER B ATTEMPTS DELETE
  // --------------------------------

  const deleteResponse = await apiClient.deleteArticle(
    tokenB,
    articleSlug
  );

  expect(deleteResponse.status()).toBe(403);

  // --------------------------------
  // VERIFY ARTICLE STILL EXISTS
  // --------------------------------

  const verifyResponse = await apiClient.getArticle(
    tokenA,
    articleSlug
  );

  expect(verifyResponse.status()).toBe(200);

  const verifyBody = await verifyResponse.json();

  expect(verifyBody.article.slug).toBe(articleSlug);

  expect(verifyBody.article.author.username).toBe(
    userA.username
  );

  expect(verifyBody.article.title).toBe(article.title);
});