import { Page, expect } from "@playwright/test";

export class LoginPage {
  private readonly loginUrl =
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";

  constructor(private page: Page) {}

  async gotoLoginPage() {
    await this.page.goto(this.loginUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await expect(this.page.locator("input[name='username']")).toBeVisible({
      timeout: 20000,
    });
    await expect(this.page.locator("input[name='password']")).toBeVisible({
      timeout: 20000,
    });
  }

  async login(username: string, password: string) {
    await this.page.locator("input[name='username']").fill(username);
    await this.page.locator("input[name='password']").fill(password);
    await Promise.all([
      this.page.waitForLoadState("domcontentloaded"),
      this.page.locator("button[type='submit']").click(),
    ]);
  }

  async loginAndWaitForDashboard(username: string, password: string) {
    await this.login(username, password);
    await expect(this.page).toHaveURL(/dashboard\/index/, { timeout: 30000 });
    await expect(
      this.page.locator("h6.oxd-topbar-header-breadcrumb-module"),
    ).toContainText("Dashboard", { timeout: 30000 });
  }
}
