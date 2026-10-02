import { Page, Locator } from '@playwright/test';

export class RegisterPage {

  private usernameInput: Locator;
  private emailInput: Locator;
  private passwordInput: Locator;
  private signUpButton: Locator;

  constructor(private page: Page) {

    this.usernameInput = page.getByPlaceholder('Username');

    this.emailInput = page.getByPlaceholder('Email');

    this.passwordInput = page.getByPlaceholder('Password');

    this.signUpButton = page.getByRole('button', {
      name: 'Sign up'
    });
  }

  async goto() {
    await this.page.goto(
      'https://conduit.bondaracademy.com/register'
    );
  }

  async register(
    username: string,
    email: string,
    password: string
  ) {

    await this.usernameInput.fill(username);

    await this.emailInput.fill(email);

    await this.passwordInput.fill(password);

    await this.signUpButton.click();
  }
}