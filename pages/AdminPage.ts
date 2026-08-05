import { Page, expect } from "@playwright/test";

export class AdminPage {
  constructor(private page: Page) {}

  async openAdminPage() {
    await this.page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers",
    );
    await expect(this.page.locator("body")).toContainText("Admin");
  }

  async searchUser(username: string) {
    const input = this.page.locator('input[placeholder="Type for hints..."]');
    await input.waitFor({ state: "visible" });
    await input.fill(username);
    await this.page.waitForLoadState("networkidle");
  }
}
