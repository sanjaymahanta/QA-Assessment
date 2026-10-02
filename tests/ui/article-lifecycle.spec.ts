import { test, expect } from '../fixtures/test-fixtures';

import {
  createTestUser,
  createTestArticle,
} from '../test-data/testData';

import { RegisterPage } from '../pages/RegisterPage';
import { EditorPage } from '../pages/EditorPage';
import { ArticlePage } from '../pages/ArticlePage';

test(
  'User can create, edit and delete an article',
  async ({ page, apiClient }) => {
    const user = createTestUser();
    const article = createTestArticle();

    // REGISTER
    const registerPage = new RegisterPage(page);

    await registerPage.goto();

    await registerPage.register(
      user.username,
      user.email,
      user.password
    );

    await expect(
      page.getByRole('link', {
        name: user.username,
      }).first()
    ).toBeVisible();

    // Capture authenticated API token for final state verification.
    const loginResponse = await apiClient.loginUser(
      user.email,
      user.password
    );

    const token = loginResponse.user.token;

    // CREATE ARTICLE
    const editorPage = new EditorPage(page);

    await editorPage.goto();

    await editorPage.fillArticle(
      article.title,
      article.description,
      article.body
    );

    await editorPage.publish();

    // VERIFY CREATED ARTICLE
    const articlePage = new ArticlePage(page);

    await articlePage.verifyTitle(article.title);

    // EDIT ARTICLE
    await articlePage.clickEdit();

    await editorPage.updateArticle(
      article.updatedTitle,
      article.updatedDescription,
      article.updatedBody
    );

    const updatedArticle =
      await editorPage.updateAndPublish();

    expect(updatedArticle.title).toBe(
      article.updatedTitle
    );

    // VERIFY UPDATED ARTICLE
    await articlePage.goto(
      updatedArticle.slug
    );

    await articlePage.verifyTitle(
      article.updatedTitle
    );

    // DELETE ARTICLE
    await articlePage.deleteArticle();

    // Verify user remains logged in.
    await expect(
      page.getByRole('link', {
        name: user.username,
      }).first()
    ).toBeVisible();

    // Verify the deleted article no longer exists through the API.
    const deletedArticleResponse =
      await apiClient.getArticle(
        token,
        updatedArticle.slug
      );

    expect(deletedArticleResponse.status()).toBe(404);
  }
);