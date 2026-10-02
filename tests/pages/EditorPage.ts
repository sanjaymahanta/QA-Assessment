import {
  Page,
  Locator,
  expect,
} from '@playwright/test';

export class EditorPage {
  private titleInput: Locator;
  private descriptionInput: Locator;
  private bodyInput: Locator;
  private publishButton: Locator;

  constructor(private page: Page) {
    this.titleInput = page.getByPlaceholder('Article Title');

    this.descriptionInput = page.getByPlaceholder(
      "What's this article about?"
    );

    this.bodyInput = page.getByPlaceholder(
      'Write your article (in markdown)'
    );

    this.publishButton = page.getByRole('button', {
      name: 'Publish Article',
    });
  }

  async goto() {
    await this.page.goto('/editor');
  }

  async fillArticle(
    title: string,
    description: string,
    body: string
  ) {
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.bodyInput.fill(body);
  }

  async publish() {
    await Promise.all([
      this.page.waitForURL(/\/article\//),
      this.publishButton.click(),
    ]);
  }

 async updateArticle(
  title: string,
  description: string,
  body: string
) {
  // Wait until Angular has populated the existing article
  // before replacing the values.
  await expect(this.titleInput).toHaveValue(/.+/);
  await expect(this.descriptionInput).toHaveValue(/.+/);
  await expect(this.bodyInput).toHaveValue(/.+/);

  await this.titleInput.fill(title);
  await this.descriptionInput.fill(description);
  await this.bodyInput.fill(body);

  await expect(this.titleInput).toHaveValue(title);
  await expect(this.descriptionInput).toHaveValue(description);
  await expect(this.bodyInput).toHaveValue(body);
}

  async updateAndPublish() {
    const responsePromise = this.page.waitForResponse(
      response =>
        response.url().includes('/api/articles/') &&
        response.request().method() === 'PUT'
    );

    await this.publishButton.click();

    const response = await responsePromise;

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.article).toBeTruthy();

    return {
      slug: responseBody.article.slug,
      title: responseBody.article.title,
    };
  }
}