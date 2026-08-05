import { Page, expect } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async gotoLoginPage() {
    await this.page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
    );
    await expect(this.page.locator("input[name='username']")).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.page.locator("input[name='username']").fill(username);
    await this.page.locator("input[name='password']").fill(password);
    await this.page.locator("button[type='submit']").click();
  }

  async loginAndWaitForDashboard(username: string, password: string) {
    await this.login(username, password);
    await expect(this.page).toHaveURL(/dashboard\/index/, { timeout: 15000 });
    await expect(
      this.page.locator("h6.oxd-topbar-header-breadcrumb-module"),
    ).toContainText("Dashboard");
  }
}
