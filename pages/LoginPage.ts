import { Page, expect } from "@playwright/test";

export class LoginPage {
  private readonly loginUrl =
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";

  constructor(private page: Page) {}

  async gotoLoginPage() {
    const usernameInput = this.page.locator("input[name='username']");
    const passwordInput = this.page.locator("input[name='password']");

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await this.page.goto(this.loginUrl, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
      } catch (error) {
        if (attempt === 3) {
          throw error;
        }

        await this.page.waitForTimeout(1000 * attempt);
        continue;
      }

      if (
        (await usernameInput
          .isVisible({ timeout: 10000 })
          .catch(() => false)) &&
        (await passwordInput.isVisible({ timeout: 10000 }).catch(() => false))
      ) {
        return;
      }

      if (/dashboard\/index/.test(this.page.url())) {
        return;
      }

      if (attempt < 3) {
        await this.page.waitForTimeout(1000 * attempt);
      }
    }

    if (/dashboard\/index/.test(this.page.url())) {
      return;
    }
    await expect(usernameInput).toBeVisible({ timeout: 30000 });
    await expect(passwordInput).toBeVisible({ timeout: 30000 });
  }

  async login(username: string, password: string) {
    await this.page.locator("input[name='username']").fill(username);
    await this.page.locator("input[name='password']").fill(password);
    // Start listening for the URL change before clicking to avoid missing the navigation event
    await Promise.all([
      this.page.waitForURL(/dashboard\/index/, { timeout: 60000 }),
      this.page.locator("button[type='submit']").click(),
    ]);
  }

  async loginAndWaitForDashboard(username: string, password: string) {
    const usernameInput = this.page.locator("input[name='username']");
    if (await usernameInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await this.login(username, password);
    }
    await expect(
      this.page.locator("h6.oxd-topbar-header-breadcrumb-module"),
    ).toHaveText(/Dashboard|Tableau de bord/i, { timeout: 30000 });
  }
}
