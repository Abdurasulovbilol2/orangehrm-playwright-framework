import { Page, expect } from "@playwright/test";

export class PIMPage {
  private readonly addEmployeeUrl =
    "https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee";

  constructor(private page: Page) {}

  async openAddEmployeePage() {
    const pimMenuItem = this.page.getByRole("link", { name: "PIM" });
    const isMenuVisible = await pimMenuItem
      .isVisible({ timeout: 15000 })
      .catch(() => false);

    if (isMenuVisible) {
      await pimMenuItem.click();
      await this.page.waitForLoadState("domcontentloaded");
      await this.page.getByRole("link", { name: "Add Employee" }).click();
    } else {
      await this.page.goto(this.addEmployeeUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
    }

    await expect(this.page).toHaveURL(/pim\/addEmployee/, { timeout: 30000 });
    await expect(
      this.page.getByRole("heading", { name: "Add Employee" }),
    ).toBeVisible({ timeout: 20000 });
  }

  async fillEmployeeForm(data: {
    firstName: string;
    middleName: string;
    lastName: string;
    employeeId: string;
  }) {
    await this.page.locator("input[name='firstName']").fill(data.firstName);
    await this.page.locator("input[name='middleName']").fill(data.middleName);
    await this.page.locator("input[name='lastName']").fill(data.lastName);

    const employeeIdInput = this.page
      .locator("div.oxd-input-group:has(label:has-text('Employee Id')) input")
      .first();
    await employeeIdInput.fill(data.employeeId);
  }

  async saveEmployee() {
    await this.page.getByRole("button", { name: "Save" }).click();
  }

  async assertEmployeeSaved(data: {
    firstName: string;
    middleName: string;
    lastName: string;
  }) {
    await expect(this.page).toHaveURL(/pim\/viewPersonalDetails\/empNumber\//, {
      timeout: 30000,
    });
    await expect(this.page.locator("input[name='firstName']")).toHaveValue(
      data.firstName,
    );
    await expect(this.page.locator("input[name='middleName']")).toHaveValue(
      data.middleName,
    );
    await expect(this.page.locator("input[name='lastName']")).toHaveValue(
      data.lastName,
    );
  }
}
