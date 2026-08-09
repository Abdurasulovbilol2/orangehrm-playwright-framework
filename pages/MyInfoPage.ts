import { Page, expect } from "@playwright/test";

export class MyInfoPage {
  private readonly myInfoUrl =
    "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails";

  constructor(private page: Page) {}

  async openMyInfoPage() {
    const myInfoMenuItem = this.page.getByRole("link", { name: "My Info" });
    const isMenuVisible = await myInfoMenuItem
      .isVisible({ timeout: 15000 })
      .catch(() => false);

    if (isMenuVisible) {
      await myInfoMenuItem.click();
      await this.page.waitForLoadState("domcontentloaded");
    } else {
      await this.page.goto(this.myInfoUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
    }

    await expect(this.page).toHaveURL(
      /pim\/(viewMyDetails|viewPersonalDetails\/empNumber\/\d+)/,
      { timeout: 30000 },
    );
  }

  async assertPersonalDetailsLoaded() {
    await expect(
      this.page.getByRole("heading", { name: "Personal Details" }).first(),
    ).toBeVisible({ timeout: 20000 });

    await expect(this.page.locator("input[name='firstName']")).toBeVisible();
    await expect(this.page.locator("input[name='middleName']")).toBeVisible();
    await expect(this.page.locator("input[name='lastName']")).toBeVisible();
  }

  async getEmployeeName() {
    const firstName =
      (await this.page.locator("input[name='firstName']").inputValue()) ?? "";
    const middleName =
      (await this.page.locator("input[name='middleName']").inputValue()) ?? "";
    const lastName =
      (await this.page.locator("input[name='lastName']").inputValue()) ?? "";

    return { firstName, middleName, lastName };
  }

  async fillPersonalNameDetails(data: {
    firstName: string;
    middleName: string;
    lastName: string;
  }) {
    await this.page.locator("input[name='firstName']").fill(data.firstName);
    await this.page.locator("input[name='middleName']").fill(data.middleName);
    await this.page.locator("input[name='lastName']").fill(data.lastName);
  }

  async fillEmployeeId(employeeId: string) {
    const employeeIdInput = this.page
      .locator("div.oxd-input-group:has(label:has-text('Employee Id')) input")
      .first();

    await expect(employeeIdInput).toBeVisible({ timeout: 15000 });
    await employeeIdInput.fill(employeeId);
  }

  async getEmployeeId() {
    const employeeIdInput = this.page
      .locator("div.oxd-input-group:has(label:has-text('Employee Id')) input")
      .first();

    await expect(employeeIdInput).toBeVisible({ timeout: 15000 });
    return employeeIdInput.inputValue();
  }

  async savePersonalDetails() {
    await this.page.getByRole("button", { name: "Save" }).first().click();

    const successToast = this.page.locator(".oxd-toast").first();
    await expect(successToast).toContainText(/Successfully/, {
      timeout: 15000,
    });
  }
}
