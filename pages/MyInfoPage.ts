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
    // Wait for async server data to populate the form before any fill operations
    await expect(this.page.locator("input[name='firstName']")).not.toHaveValue(
      "",
      { timeout: 15000 },
    );
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

  async assertPersonalNameDetails(data: {
    firstName: string;
    middleName: string;
    lastName: string;
  }) {
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

  async assertEmployeeId(expected: string) {
    const input = this.page
      .locator("div.oxd-input-group:has(label:has-text('Employee Id')) input")
      .first();
    await expect(input).toHaveValue(expected);
  }

  async fillOtherId(otherId: string) {
    const input = this.page
      .locator("div.oxd-input-group:has(label:has-text('Other Id')) input")
      .first();
    await expect(input).toBeVisible({ timeout: 15000 });
    await input.fill(otherId);
  }

  async assertOtherId(expected: string) {
    const input = this.page
      .locator("div.oxd-input-group:has(label:has-text('Other Id')) input")
      .first();
    await expect(input).toHaveValue(expected);
  }

  async fillDriversLicense(licenseNumber: string) {
    const input = this.page
      .locator(
        'div.oxd-input-group:has(label:has-text("Driver\'s License Number")) input',
      )
      .first();
    await expect(input).toBeVisible({ timeout: 15000 });
    await input.fill(licenseNumber);
  }

  async assertDriversLicense(expected: string) {
    const input = this.page
      .locator(
        'div.oxd-input-group:has(label:has-text("Driver\'s License Number")) input',
      )
      .first();
    await expect(input).toHaveValue(expected);
  }

  async fillLicenseExpiryDate(date: string) {
    const input = this.page
      .locator(
        "div.oxd-input-group:has(label:has-text('License Expiry Date')) input",
      )
      .first();
    await expect(input).toBeVisible({ timeout: 15000 });
    await input.fill(date);
  }

  async assertLicenseExpiryDate(expected: string) {
    const input = this.page
      .locator(
        "div.oxd-input-group:has(label:has-text('License Expiry Date')) input",
      )
      .first();
    await expect(input).toHaveValue(expected);
  }

  async selectNationality(nationality: string) {
    const dropdown = this.page.locator(
      "div.oxd-input-group:has(label:has-text('Nationality')) .oxd-select-text",
    );
    await dropdown.click();
    await this.page.getByRole("option", { name: nationality }).click();
  }

  async assertNationality(expected: string) {
    const dropdown = this.page.locator(
      "div.oxd-input-group:has(label:has-text('Nationality')) .oxd-select-text",
    );
    await expect(dropdown).toContainText(expected);
  }

  async selectMaritalStatus(status: string) {
    const dropdown = this.page.locator(
      "div.oxd-input-group:has(label:has-text('Marital Status')) .oxd-select-text",
    );
    await dropdown.click();
    await this.page.getByRole("option", { name: status }).click();
  }

  async assertMaritalStatus(expected: string) {
    const dropdown = this.page.locator(
      "div.oxd-input-group:has(label:has-text('Marital Status')) .oxd-select-text",
    );
    await expect(dropdown).toContainText(expected);
  }

  async fillDateOfBirth(date: string) {
    const input = this.page
      .locator("div.oxd-input-group:has(label:has-text('Date of Birth')) input")
      .first();
    await expect(input).toBeVisible({ timeout: 15000 });
    await input.fill(date);
  }

  async assertDateOfBirth(expected: string) {
    const input = this.page
      .locator("div.oxd-input-group:has(label:has-text('Date of Birth')) input")
      .first();
    await expect(input).toHaveValue(expected);
  }

  async selectGender(gender: "Male" | "Female") {
    await this.page.getByRole("radio", { name: gender, exact: true }).check();
  }

  async assertGender(gender: "Male" | "Female") {
    await expect(
      this.page.getByRole("radio", { name: gender, exact: true }),
    ).toBeChecked();
  }

  async savePersonalDetails() {
    await this.page.getByRole("button", { name: "Save" }).first().click();

    const successToast = this.page.locator(".oxd-toast").first();
    await expect(successToast).toContainText(/Successfully/, {
      timeout: 15000,
    });
  }
}
