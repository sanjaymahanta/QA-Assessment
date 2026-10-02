import { test, expect } from '../fixtures/test-fixtures';
import {
  createTestUser,
} from '../test-data/testData';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';

test('User can sign up and sign in', async ({ page }) => {

  const user = createTestUser();

  // --------------------------------
  // REGISTER
  // --------------------------------

  const registerPage = new RegisterPage(page);

  await registerPage.goto();

  await registerPage.register(
    user.username,
    user.email,
    user.password
  );

  // Verify registration/login
  await expect(
    page.getByRole('link', {
      name: user.username,
    })
  ).toBeVisible();

  // --------------------------------
  // SETTINGS
  // --------------------------------

  await page.getByRole('link', {
    name: 'Settings',
  }).click();

  await expect(
    page.getByRole('heading', {
      name: 'Your Settings',
    })
  ).toBeVisible();

  // --------------------------------
  // LOGOUT
  // --------------------------------

  await page.getByRole('button', {
    name: 'Or click here to logout.',
  }).click();

  await expect(
    page.getByRole('link', {
      name: 'Sign up',
    })
  ).toBeVisible();

  // --------------------------------
  // LOGIN
  // --------------------------------

  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.login(
    user.email,
    user.password
  );

  await loginPage.verifyLogin();

  // Verify correct user
  await expect(
    page.getByRole('link', {
      name: user.username,
    })
  ).toBeVisible();
});