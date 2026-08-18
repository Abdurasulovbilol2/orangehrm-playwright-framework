import { Page, expect } from "@playwright/test";

export class MaintenancePage {
  private readonly maintenanceUrl =
    "https://opensource-demo.orangehrmlive.com/web/index.php/maintenance/viewMaintenanceModule";

  constructor(private page: Page) {}

  async openMaintenancePage(password: string) {
    const maintenanceMenuItem = this.page.getByRole("link", {
      name: "Maintenance",
      exact: true,
    });
    const isMenuVisible = await maintenanceMenuItem
      .isVisible({ timeout: 15000 })
      .catch(() => false);

    if (isMenuVisible) {
      await maintenanceMenuItem.click();
      await this.page.waitForLoadState("domcontentloaded");
    } else {
      await this.page.goto(this.maintenanceUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
    }

    await expect(this.page).toHaveURL(
      /maintenance\/(viewMaintenanceModule|purgeEmployee)/,
      {
        timeout: 30000,
      },
    );

    await expect(
      this.page.getByText("Administrator Access", { exact: true }),
    ).toBeVisible({ timeout: 15000 });

    const passwordInput = this.page.locator("input[type='password']").first();
    await expect(passwordInput).toBeVisible({ timeout: 15000 });
    await passwordInput.fill(password);
    await expect(passwordInput).toHaveValue(password);
    await this.page
      .getByRole("button", { name: "Confirm", exact: true })
      .click();

    await expect(
      this.page.locator("h6.oxd-topbar-header-breadcrumb-module"),
    ).toHaveText("Maintenance", { timeout: 30000 });
  }
}
