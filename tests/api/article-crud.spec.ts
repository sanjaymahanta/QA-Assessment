import { test, expect } from '../fixtures/test-fixtures';
import {
  createTestUser,
  createTestArticle,
} from '../test-data/testData';

test('Register user and complete article CRUD through API', async ({
  apiClient,
}) => {

  const user = createTestUser();
  const article = createTestArticle();

  // --------------------------------
  // REGISTER USER
  // --------------------------------

  const registerResponse = await apiClient.registerUser(
    user.username,
    user.email,
    user.password
  );

  const token = registerResponse.user.token;

  expect(registerResponse.user.username).toBe(user.username);
  expect(registerResponse.user.email).toBe(user.email);
  expect(token).toBeTruthy();

  // --------------------------------
  // CREATE ARTICLE
  // --------------------------------

  const createResponse = await apiClient.createArticle(
    token,
    article.title,
    article.description,
    article.body
  );

  const createdArticle = createResponse.article;

  expect(createdArticle.title).toBe(article.title);
  expect(createdArticle.description).toBe(article.description);
  expect(createdArticle.body).toBe(article.body);

  const originalSlug = createdArticle.slug;

  // --------------------------------
  // READ ARTICLE
  // --------------------------------

  const readResponse = await apiClient.getArticle(
    token,
    originalSlug
  );

  expect(readResponse.status()).toBe(200);

  const readBody = await readResponse.json();

  expect(readBody.article.slug).toBe(originalSlug);
  expect(readBody.article.title).toBe(article.title);
  expect(readBody.article.author.username).toBe(user.username);

  // --------------------------------
  // UPDATE ARTICLE
  // --------------------------------

  const updateResponse = await apiClient.updateArticle(
    token,
    originalSlug,
    article.updatedTitle,
    article.updatedDescription,
    article.updatedBody
  );

  expect(updateResponse.status()).toBe(200);

  const updateBody = await updateResponse.json();

  expect(updateBody.article.title).toBe(article.updatedTitle);
  expect(updateBody.article.description).toBe(
    article.updatedDescription
  );
  expect(updateBody.article.body).toBe(article.updatedBody);

  const updatedSlug = updateBody.article.slug;

  // --------------------------------
  // VERIFY UPDATED ARTICLE
  // --------------------------------

  const verifyResponse = await apiClient.getArticle(
    token,
    updatedSlug
  );

  expect(verifyResponse.status()).toBe(200);

  const verifyBody = await verifyResponse.json();

  expect(verifyBody.article.title).toBe(article.updatedTitle);
  expect(verifyBody.article.body).toBe(article.updatedBody);

  // --------------------------------
  // DELETE ARTICLE
  // --------------------------------

  const deleteResponse = await apiClient.deleteArticle(
    token,
    updatedSlug
  );

  expect(deleteResponse.status()).toBe(204);

  // --------------------------------
  // VERIFY DELETION
  // --------------------------------

  const deletedResponse = await apiClient.getArticle(
    token,
    updatedSlug
  );

  expect(deletedResponse.status()).toBe(404);
});