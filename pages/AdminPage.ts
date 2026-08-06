import { Page, expect } from "@playwright/test";

export class AdminPage {
  private readonly adminUrl =
    "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers";

  constructor(private page: Page) {}

  async openAdminPage() {
    const adminMenuItem = this.page.getByRole("link", { name: "Admin" });
    const isAdminMenuVisible = await adminMenuItem
      .isVisible({ timeout: 15000 })
      .catch(() => false);

    if (isAdminMenuVisible) {
      await adminMenuItem.click();
      await this.page.waitForLoadState("domcontentloaded");
    } else {
      await this.page.goto(this.adminUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
    }

    await expect(this.page).toHaveURL(/admin/, { timeout: 30000 });

    const adminHeader = this.page.locator(
      "h6.oxd-topbar-header-breadcrumb-module",
    );

    try {
      await expect(adminHeader).toContainText("Admin", { timeout: 15000 });
    } catch {
      // Retry a direct admin route once when the first render returns a blank page in CI.
      await this.page.goto(this.adminUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await expect(this.page).toHaveURL(/admin/, { timeout: 30000 });
      await expect(adminHeader).toContainText("Admin", { timeout: 20000 });
    }
  }

  async searchUser(username: string) {
    const input = this.page.locator('input[placeholder="Type for hints..."]');
    await input.waitFor({ state: "visible" });
    await input.fill(username);
    await this.page.waitForLoadState("networkidle");
  }
}
