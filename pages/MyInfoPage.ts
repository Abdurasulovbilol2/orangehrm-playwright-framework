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

  async openContactDetails() {
    await this.page.getByRole("link", { name: "Contact Details" }).click();
    await expect(this.page).toHaveURL(/pim\/contactDetails\/empNumber\/\d+/, {
      timeout: 30000,
    });
  }

  async assertContactDetailsLoaded() {
    await expect(
      this.page.getByRole("heading", { name: "Contact Details" }).first(),
    ).toBeVisible({ timeout: 20000 });

    await expect(this.getWorkTelephoneInput()).toBeVisible({ timeout: 15000 });
  }

  async fillWorkTelephone(workPhone: string) {
    const workPhoneInput = this.getWorkTelephoneInput();
    await expect(workPhoneInput).toBeVisible({ timeout: 15000 });
    await workPhoneInput.fill(workPhone);
  }

  async assertWorkTelephone(expected: string) {
    const workPhoneInput = this.getWorkTelephoneInput();
    await expect(workPhoneInput).toHaveValue(expected);
  }

  async fillContactDetailsForm(data: {
    street1: string;
    street2: string;
    city: string;
    stateProvince: string;
    zipPostalCode: string;
    country: string;
    homePhone: string;
    mobilePhone: string;
    workPhone: string;
    workEmail: string;
    otherEmail: string;
  }) {
    await this.getAddressInput("Street 1").fill(data.street1);
    await this.getAddressInput("Street 2").fill(data.street2);
    await this.getAddressInput("City").fill(data.city);
    await this.getAddressInput("State/Province").fill(data.stateProvince);
    await this.getAddressInput("Zip/Postal Code").fill(data.zipPostalCode);
    await this.selectAddressCountry(data.country);

    await this.getTelephoneInput("Home").fill(data.homePhone);
    await this.getTelephoneInput("Mobile").fill(data.mobilePhone);
    await this.getWorkTelephoneInput().fill(data.workPhone);

    await this.getEmailInput("Work Email").fill(data.workEmail);
    await this.getEmailInput("Other Email").fill(data.otherEmail);
  }

  async assertContactDetailsForm(data: {
    street1: string;
    street2: string;
    city: string;
    stateProvince: string;
    zipPostalCode: string;
    country: string;
    homePhone: string;
    mobilePhone: string;
    workPhone: string;
    workEmail: string;
    otherEmail: string;
  }) {
    await expect(this.getAddressInput("Street 1")).toHaveValue(data.street1);
    await expect(this.getAddressInput("Street 2")).toHaveValue(data.street2);
    await expect(this.getAddressInput("City")).toHaveValue(data.city);
    await expect(this.getAddressInput("State/Province")).toHaveValue(
      data.stateProvince,
    );
    await expect(this.getAddressInput("Zip/Postal Code")).toHaveValue(
      data.zipPostalCode,
    );
    await expect(this.getAddressCountryDropdown()).toContainText(data.country);

    await expect(this.getTelephoneInput("Home")).toHaveValue(data.homePhone);
    await expect(this.getTelephoneInput("Mobile")).toHaveValue(
      data.mobilePhone,
    );
    await expect(this.getWorkTelephoneInput()).toHaveValue(data.workPhone);

    await expect(this.getEmailInput("Work Email")).toHaveValue(data.workEmail);
    await expect(this.getEmailInput("Other Email")).toHaveValue(
      data.otherEmail,
    );
  }

  async openEmergencyContacts() {
    await this.page.getByRole("link", { name: "Emergency Contacts" }).click();
    await expect(this.page).toHaveURL(
      /pim\/viewEmergencyContacts\/empNumber\/\d+/,
      {
        timeout: 30000,
      },
    );
  }

  async assertEmergencyContactsLoaded() {
    await expect(
      this.page.getByRole("heading", { name: "Assigned Emergency Contacts" }),
    ).toBeVisible({ timeout: 20000 });
    await expect(this.getEmergencyContactsAddButton()).toBeVisible({
      timeout: 15000,
    });
  }

  async addEmergencyContact(data: {
    name: string;
    relationship: string;
    homeTelephone: string;
    mobile: string;
    workTelephone: string;
  }) {
    await this.getEmergencyContactsAddButton().click();

    const form = this.page.locator("form").last();
    await expect(form).toBeVisible({ timeout: 15000 });

    await this.getInputFromForm(form, "Name").fill(data.name);
    await this.getInputFromForm(form, "Relationship").fill(data.relationship);
    await this.getInputFromForm(form, "Home Telephone").fill(
      data.homeTelephone,
    );
    await this.getInputFromForm(form, "Mobile").fill(data.mobile);
    await this.getInputFromForm(form, "Work Telephone").fill(
      data.workTelephone,
    );

    await form.getByRole("button", { name: "Save" }).click();

    const successToast = this.page.locator(".oxd-toast").first();
    await expect(successToast).toContainText(/Successfully/, {
      timeout: 15000,
    });
  }

  async assertEmergencyContactRow(data: {
    name: string;
    relationship: string;
  }) {
    const row = this.page
      .locator(".oxd-table-row")
      .filter({ hasText: data.name })
      .filter({ hasText: data.relationship })
      .first();

    await expect(row).toBeVisible({ timeout: 20000 });
  }

  async saveContactDetails() {
    await this.page.getByRole("button", { name: "Save" }).first().click();

    const successToast = this.page.locator(".oxd-toast").first();
    await expect(successToast).toContainText(/Successfully/, {
      timeout: 15000,
    });
  }

  async savePersonalDetails() {
    await this.page.getByRole("button", { name: "Save" }).first().click();

    const successToast = this.page.locator(".oxd-toast").first();
    await expect(successToast).toContainText(/Successfully/, {
      timeout: 15000,
    });
  }

  private getWorkTelephoneInput() {
    return this.getSectionInputByLabel("Telephone", "Work");
  }

  private getAddressInput(label: string) {
    return this.getSectionInputByLabel("Address", label);
  }

  private getTelephoneInput(label: string) {
    return this.getSectionInputByLabel("Telephone", label);
  }

  private getEmailInput(label: string) {
    return this.getSectionInputByLabel("Email", label);
  }

  private getAddressCountryDropdown() {
    return this.getSectionContainer("Address")
      .locator(
        "div.oxd-input-group:has(label:has-text('Country')) .oxd-select-text",
      )
      .first();
  }

  private async selectAddressCountry(country: string) {
    const countryDropdown = this.getAddressCountryDropdown();
    await countryDropdown.click();
    await this.page.getByRole("option", { name: country }).click();
  }

  private getSectionContainer(
    sectionHeading: "Address" | "Telephone" | "Email",
  ) {
    return this.page
      .getByRole("heading", { name: sectionHeading })
      .locator("xpath=following-sibling::div[1]");
  }

  private getSectionInputByLabel(
    sectionHeading: "Address" | "Telephone" | "Email",
    label: string,
  ) {
    return this.getSectionContainer(sectionHeading)
      .locator("div.oxd-input-group")
      .filter({ hasText: label })
      .locator("input")
      .first();
  }

  private getInputFromForm(form: ReturnType<Page["locator"]>, label: string) {
    return form
      .locator("div.oxd-input-group")
      .filter({ hasText: label })
      .locator("input")
      .first();
  }

  private getEmergencyContactsAddButton() {
    const emergencyCard = this.page
      .getByRole("heading", { name: "Assigned Emergency Contacts" })
      .locator(
        "xpath=ancestor::div[contains(@class,'orangehrm-card-container')][1]",
      );

    return emergencyCard.getByRole("button", { name: /Add/ }).first();
  }
}
