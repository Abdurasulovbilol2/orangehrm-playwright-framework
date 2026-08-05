import { Page, expect } from "@playwright/test";

export class AdminPage {
  constructor(private page: Page) {}

  async openAdminPage() {
    await this.page.getByRole("link", { name: "Admin" }).click();
    await this.page.waitForURL(/\/admin\/viewSystemUsers/);
    await expect(this.page.locator("body")).toContainText("Admin");
  }

  async searchUser(username: string) {
    await this.page.getByPlaceholder("Type for hints...").fill(username);
  }
}
