import {
  expect,
  Page,
  Locator,
} from '@playwright/test';

export class ArticlePage {
  private articleTitle: Locator;
  private editButton: Locator;
  private deleteButton: Locator;

  constructor(private page: Page) {
    this.articleTitle = page.locator('h1');

    this.editButton = page.getByRole('link', {
      name: 'Edit Article',
    });

    this.deleteButton = page.getByRole('button', {
      name: 'Delete Article',
    });
  }

  async goto(slug: string) {
    await this.page.goto(
      `/article/${slug}?refresh=${Date.now()}`,
      {
        waitUntil: 'networkidle',
      }
    );
  }

  async verifyTitle(title: string) {
    await expect(this.articleTitle).toHaveText(title);
  }

 async clickEdit() {
  await Promise.all([
    this.page.waitForURL(/\/editor/),
    this.editButton.first().click(),
  ]);
}

  async deleteArticle() {
    await this.deleteButton.first().click();
  }
}