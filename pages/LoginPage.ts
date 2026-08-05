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
}
