import { Page, expect } from "@playwright/test";

export class AdminPage {
  constructor(private page: Page) {}

  async openAdminPage() {
    const adminMenuItem = this.page.getByRole("link", { name: "Admin" });
    const isAdminMenuVisible = await adminMenuItem
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (isAdminMenuVisible) {
      await adminMenuItem.click();
      await this.page.waitForLoadState("domcontentloaded");
    } else {
      try {
        await this.page.goto(
          "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers",
          { waitUntil: "domcontentloaded" },
        );
      } catch {
        await this.page.waitForTimeout(1000);
        await this.page.goto(
          "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers",
          { waitUntil: "domcontentloaded" },
        );
      }
    }

    await expect(this.page).toHaveURL(/admin/, { timeout: 15000 });
    await expect(this.page.locator("body")).toContainText("Admin");
  }

  async searchUser(username: string) {
    const input = this.page.locator('input[placeholder="Type for hints..."]');
    await input.waitFor({ state: "visible" });
    await input.fill(username);
    await this.page.waitForLoadState("networkidle");
  }
}
