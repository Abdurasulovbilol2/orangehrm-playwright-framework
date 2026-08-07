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

  async clickAddButton() {
    await this.page.getByRole("button", { name: "Add" }).click();
  }

  async selectUserRole(role: string) {
    const dropdown = this.page.locator(".oxd-form .oxd-select-text").first();
    await dropdown.click();
    await this.page.getByRole("option", { name: role }).click();
  }

  async fillEmployeeName(name: string) {
    const input = this.page.locator(
      ".oxd-form input[placeholder='Type for hints...']",
    );
    await input.waitFor({ state: "visible" });
    await input.fill(name); // 1. types "charifa bel belgueroua"

    const suggestion = this.page
      .locator(".oxd-autocomplete-dropdown .oxd-autocomplete-option")
      .first();
    await suggestion.waitFor({ state: "visible", timeout: 10000 }); // 2. waits for dropdown
    await suggestion.click(); // 3. clicks the suggestion
  }

  async selectstatus(status: string) {
    const dropdown = this.page.locator(".oxd-form .oxd-select-text").nth(1);
    await dropdown.click();
    await this.page.getByRole("option", { name: status }).click();
  }

  async Choosepassword(password: string) {
    const fields = this.page.locator("input[type='password']");
    await fields.nth(0).fill(password);
    await fields.nth(1).fill(password);
  }
  async fillUsername(username: string) {
    const input = this.page
      .locator(".oxd-form input[autocomplete='off']")
      .first();
    await input.waitFor({ state: "visible" });
    await input.fill(username);
  }

  async clickbuttonsave() {
    await this.page.getByRole("button", { name: "save" }).click;
  }

  async searchUser(username: string) {
    const input = this.page.locator('input[placeholder="Type for hints..."]');
    await input.waitFor({ state: "visible" });
    await input.fill(username);
    await this.page.waitForLoadState("networkidle");
  }
}

// Example usage:
// const adminPage = new AdminPage(page);
// await adminPage.openAdminPage();
// await adminPage.clickAddButton();
// await adminPage.selectUserRole("Admin"); // or "ESS");
// await adminPage.searchUser("john.doe");
