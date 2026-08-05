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
    await this.page.getByPlaceholder("Type for hints...").fill(username);
  }
}
