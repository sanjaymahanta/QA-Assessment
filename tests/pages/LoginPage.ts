import { expect, Page, Locator } from '@playwright/test';

export class LoginPage {

  private emailInput: Locator;
  private passwordInput: Locator;
  private signInButton: Locator;
  private globalFeed: Locator;

  constructor(private page: Page) {

    this.emailInput = page.getByPlaceholder('Email');

    this.passwordInput = page.getByPlaceholder('Password');

    this.signInButton = page.getByRole('button', {
      name: 'Sign in'
    });

    this.globalFeed = page.getByText('Global Feed', {
      exact: true
    });
  }

  async goto() {
    await this.page.goto(
      'https://conduit.bondaracademy.com/login'
    );
  }

  async login(email: string, password: string) {

    await this.emailInput.fill(email);

    await this.passwordInput.fill(password);

    await this.signInButton.click();
  }

  async verifyLogin() {

    await expect(
      this.globalFeed
    ).toBeVisible();
  }
}