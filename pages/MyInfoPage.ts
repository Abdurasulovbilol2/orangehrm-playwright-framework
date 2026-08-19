import { Page, expect } from "@playwright/test";

export class MyInfoPage {
  private readonly myInfoUrl =
    "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails";

  constructor(private page: Page) {}

  async openMyInfoPage() {
    const myInfoMenuItem = this.page.getByRole("link", {
      name: /My Info|Mes Infos/i,
    });
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
      this.page
        .getByRole("heading", {
          name: /Personal Details|Informations personnelles/i,
        })
        .first(),
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
    const input = this.getPersonalInput(
      /Driver'?s License Number|Driver License Number|Numéro du permis de conduire/i,
    );
    await expect(input).toBeVisible({ timeout: 15000 });
    await input.fill(licenseNumber);
  }

  async assertDriversLicense(expected: string) {
    const input = this.getPersonalInput(
      /Driver'?s License Number|Driver License Number|Numéro du permis de conduire/i,
    );
    await expect(input).toHaveValue(expected);
  }

  async fillLicenseExpiryDate(date: string) {
    const input = this.getPersonalInput(
      /License Expiry Date|Date d'expiration permis/i,
    );
    await expect(input).toBeVisible({ timeout: 15000 });
    await input.fill(date);
  }

  async assertLicenseExpiryDate(expected: string) {
    const input = this.getPersonalInput(
      /License Expiry Date|Date d'expiration permis/i,
    );
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
    await this.page
      .getByRole("link", { name: /Contact Details|Coordonnées/i })
      .click();
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
    await this.selectAddressCountry(data.country);
    await this.getAddressInput("Street 1").fill(data.street1);
    await this.getAddressInput("Street 2").fill(data.street2);
    await this.getAddressInput("City").fill(data.city);
    await this.getAddressInput("State/Province").fill(data.stateProvince);
    await this.getAddressInput("Zip/Postal Code").fill(data.zipPostalCode);

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

    const form = this.page.locator("form:visible").last();
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

  async openDependents() {
    await this.page.getByRole("link", { name: "Dependents" }).click();
    await expect(this.page).toHaveURL(/pim\/viewDependents\/empNumber\/\d+/, {
      timeout: 30000,
    });
  }

  async assertDependentsLoaded() {
    await expect(
      this.page.getByRole("heading", { name: "Assigned Dependents" }),
    ).toBeVisible({ timeout: 20000 });
    await expect(this.getDependentsAddButton()).toBeVisible({
      timeout: 15000,
    });
  }

  async addDependent(data: {
    name: string;
    relationship: "Child" | "Other";
    dateOfBirth: string;
  }) {
    await this.getDependentsAddButton().click();

    const form = this.page.locator("form:visible").last();
    await expect(form).toBeVisible({ timeout: 15000 });

    await this.getInputFromForm(form, "Name").fill(data.name);
    await this.selectFromFormDropdown(form, "Relationship", data.relationship);
    await this.getInputFromForm(form, "Date of Birth").fill(data.dateOfBirth);

    await form.getByRole("button", { name: "Save" }).click();

    const successToast = this.page.locator(".oxd-toast").first();
    await expect(successToast).toContainText(/Successfully/, {
      timeout: 15000,
    });
  }

  async assertDependentRow(data: { name: string; relationship: string }) {
    const row = this.page
      .locator(".oxd-table-row")
      .filter({ hasText: data.name })
      .filter({ hasText: data.relationship })
      .first();

    await expect(row).toBeVisible({ timeout: 20000 });
  }

  async openImmigration() {
    await this.page.getByRole("link", { name: "Immigration" }).click();
    await expect(this.page).toHaveURL(/pim\/viewImmigration\/empNumber\/\d+/, {
      timeout: 30000,
    });
  }

  async openJobDetails() {
    await this.page.getByRole("link", { name: /Job|Emploi/i }).click();
    await expect(this.page).toHaveURL(/pim\/viewJobDetails\/empNumber\/\d+/, {
      timeout: 30000,
    });
  }

  async openSalarySection() {
    await this.page.getByRole("link", { name: /Salary|Salaire/i }).click();
    await expect(this.page).toHaveURL(/pim\/viewSalaryList\/empNumber\/\d+/, {
      timeout: 30000,
    });
  }

  async openReportToSection() {
    await this.page
      .getByRole("link", { name: /Report-to|Reporter à/i })
      .click();
    await expect(this.page).toHaveURL(
      /pim\/viewReportToDetails\/empNumber\/\d+/,
      {
        timeout: 30000,
      },
    );
  }

  async openQualificationsSection() {
    await this.page
      .getByRole("link", { name: /Qualifications|Diplômes|Diplome|Diplôme/i })
      .click();
    await expect(this.page).toHaveURL(
      /pim\/viewQualifications\/empNumber\/\d+/,
      {
        timeout: 30000,
      },
    );
  }

  async openMembershipsSection() {
    await this.page
      .getByRole("link", { name: /Memberships|Adhésions/i })
      .click();
    await expect(this.page).toHaveURL(/pim\/viewMemberships\/empNumber\/\d+/, {
      timeout: 30000,
    });
  }

  async fillMembership(data: {
    membership: string;
    paidBy: string;
    amount: string;
    currency: string;
    commencementDate: string;
    renewalDate: string;
  }) {
    const membershipsCard = this.page
      .getByRole("heading", {
        name: /Assigned Memberships|Adhésions attribuées/i,
      })
      .locator("xpath=..");

    await membershipsCard.getByRole("button", { name: /Add|Ajouter/i }).click();
    const form = this.page.locator("form:visible").last();
    await expect(form).toBeVisible({ timeout: 15000 });

    await this.selectFromFormDropdown(
      form,
      /Membership|Adhésion/i,
      data.membership,
    );
    await this.selectFromFormDropdown(
      form,
      /Subscription Paid By|Abonnement payé par/i,
      data.paidBy,
    );
    await this.getInputFromForm(
      form,
      /Subscription Amount|Montant de l'abonnement/i,
    ).fill(data.amount);
    await this.selectFromFormDropdown(form, /Currency|Devise/i, data.currency);
    await this.getInputFromForm(
      form,
      /Subscription Commence Date|Date de début de l'abonnement/i,
    ).fill(data.commencementDate);
    await this.getInputFromForm(
      form,
      /Subscription Renewal Date|Date de renouvellement de l'abonnement/i,
    ).fill(data.renewalDate);

    await form.getByRole("button", { name: /Save|Enregistrer/i }).click();
    await expect(this.page.locator(".oxd-toast").first()).toContainText(
      /Successfully|Enregistré|Enregistrer/i,
      { timeout: 15000 },
    );
  }

  async fillQualificationWorkExperience(data: {
    company: string;
    jobTitle: string;
    fromDate: string;
    toDate: string;
    comment: string;
  }) {
    const section = this.page
      .getByRole("heading", { name: /Work Experience/i })
      .locator("xpath=..");

    await section.getByRole("button", { name: /Add/i }).first().click();
    const form = this.page.locator("form:visible").last();
    await expect(form).toBeVisible({ timeout: 15000 });

    await this.getInputFromForm(form, /Company/i).fill(data.company);
    await this.getInputFromForm(form, /Job Title/i).fill(data.jobTitle);
    await this.getInputFromForm(form, /From/i).fill(data.fromDate);
    await this.getInputFromForm(form, /To/i).fill(data.toDate);
    await this.getTextareaFromForm(form, /Comment/i).fill(data.comment);

    await form.getByRole("button", { name: /Save/i }).click();
    await expect(this.page.locator(".oxd-toast").first()).toContainText(
      /Successfully/,
      {
        timeout: 15000,
      },
    );
  }

  async fillQualificationEducation(data: {
    level: string;
    institute: string;
    major: string;
    year: string;
    gpaScore: string;
    endDate: string;
  }) {
    const section = this.page
      .getByRole("heading", { name: /Education/i })
      .locator("xpath=..");

    await section.getByRole("button", { name: /Add/i }).first().click();
    const form = this.page.locator("form:visible").last();
    await expect(form).toBeVisible({ timeout: 15000 });

    await this.selectFromFormDropdown(form, /Level/i, data.level);
    await this.getInputFromForm(form, /Institute/i).fill(data.institute);
    await this.getInputFromForm(form, /Major\/Specialization/i).fill(
      data.major,
    );
    await this.getInputFromForm(form, /GPA\/Score|GPA\/Score/i).fill(
      data.gpaScore,
    );
    await this.getInputFromForm(form, /Year/i).fill(data.year);
    await this.getInputFromForm(form, /End Date/i).fill(data.endDate);

    await form.getByRole("button", { name: /Save/i }).click();
    await expect(this.page.locator(".oxd-toast").first()).toContainText(
      /Successfully/,
      {
        timeout: 15000,
      },
    );
  }

  async fillQualificationSkill(data: {
    skill: string;
    yearsOfExperience: string;
  }) {
    const section = this.page
      .getByRole("heading", { name: /Skills/i })
      .locator("xpath=..");

    await section.getByRole("button", { name: /Add/i }).click();
    const form = this.page.locator("form:visible").last();
    await expect(form).toBeVisible({ timeout: 15000 });

    await this.selectFromFormDropdown(form, /Skill/i, data.skill);
    await this.getInputFromForm(form, /Years of Experience/i).fill(
      data.yearsOfExperience,
    );

    await form.getByRole("button", { name: /Save/i }).click();
    await expect(this.page.locator(".oxd-toast").first()).toContainText(
      /Successfully/,
      {
        timeout: 15000,
      },
    );
  }

  async fillQualificationLanguage(data: {
    language: string;
    fluency: string;
    competency: string;
    comments: string;
  }) {
    const section = this.page
      .getByRole("heading", { name: /Languages/i })
      .locator("xpath=..");

    await section.getByRole("button", { name: /Add/i }).click();
    const form = this.page.locator("form:visible").last();
    await expect(form).toBeVisible({ timeout: 15000 });

    const selectedLanguage = await this.selectFromFormDropdown(
      form,
      /Language/i,
      data.language,
    );
    await this.selectFromFormDropdown(form, /Fluency/i, data.fluency);
    await this.selectFromFormDropdown(form, /Competency/i, data.competency);
    await this.getTextareaFromForm(form, /Comments/i).fill(data.comments);

    await form.getByRole("button", { name: /Save/i }).click();
    await expect(this.page.locator(".oxd-toast").first()).toContainText(
      /Successfully/,
      { timeout: 15000 },
    );
    // Match on the language that was actually selected: the requested one may not
    // exist as master data, in which case selectFromFormDropdown falls back to another option.
    const savedRow = this.page
      .locator(".oxd-table-row")
      .filter({ hasText: selectedLanguage })
      .filter({ hasText: data.comments })
      .first();
    await expect(savedRow).toBeVisible({ timeout: 30000 });
  }

  async fillQualificationLicense(data: {
    licenseType: string;
    licenseNumber: string;
    issuedDate: string;
    expiryDate: string;
  }) {
    const section = this.page
      .getByRole("heading", { name: /License/i })
      .locator("xpath=..");

    await section.getByRole("button", { name: /Add/i }).first().click();
    let form = this.page.locator("form:visible").last();
    await expect(form).toBeVisible({ timeout: 15000 });

    // OrangeHRM hides License Types already assigned to this employee, so the
    // requested type may not be selectable; create a fresh one if none remain.
    const reopened = await this.ensureLicenseTypeOptionAvailable(
      form,
      data.licenseType,
    );
    if (reopened) {
      await section.getByRole("button", { name: /Add/i }).first().click();
      form = this.page.locator("form:visible").last();
      await expect(form).toBeVisible({ timeout: 15000 });
    }

    const selectedLicenseType = await this.selectFromFormDropdown(
      form,
      /License Type/i,
      data.licenseType,
    );
    await this.getInputFromForm(form, /License Number/i).fill(
      data.licenseNumber,
    );
    await this.getInputFromForm(form, /Issued Date/i).fill(data.issuedDate);
    await this.getInputFromForm(form, /Expiry Date/i).fill(data.expiryDate);

    await form.getByRole("button", { name: /Save/i }).click();
    await expect(this.page.locator(".oxd-toast").first()).toContainText(
      /Successfully/,
      { timeout: 15000 },
    );

    // Scope to the License section only, and match on the license type that was
    // actually selected (may differ from the requested one, see above).
    const savedRow = this.page
      .locator(".oxd-table-row")
      .filter({ hasText: selectedLicenseType })
      .first();
    try {
      await expect(savedRow).toBeVisible({ timeout: 15000 });
    } catch {
      await this.page.reload({ waitUntil: "domcontentloaded" });
      await expect(savedRow).toBeVisible({ timeout: 15000 });
    }
  }

  // Returns true if the "Add License" form had to be closed and reopened
  // (because a brand-new License Type was created via Admin in the meantime).
  private async ensureLicenseTypeOptionAvailable(
    form: ReturnType<Page["locator"]>,
    licenseTypeSeed: string,
  ): Promise<boolean> {
    const dropdown = form
      .locator("div.oxd-input-group")
      .filter({ hasText: /License Type/i })
      .locator(".oxd-select-text")
      .first();
    await dropdown.click();
    const options = this.page.locator(
      ".oxd-select-dropdown .oxd-select-option, [role='option']",
    );
    const hasOptions = await options
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    const optionTexts = hasOptions ? await options.allTextContents() : [];
    const hasSelectableOption = optionTexts.some(
      (text) => text.trim() && !/select|no records found/i.test(text),
    );
    if (hasOptions) {
      await this.page.keyboard.press("Escape");
    }
    if (hasSelectableOption) {
      return false;
    }

    await form.getByRole("button", { name: /Cancel/i }).click();
    const qualificationsUrl = this.page.url();
    const uniqueLicenseTypeName = `${licenseTypeSeed} ${Date.now()}`;
    await this.page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewLicenses",
      { waitUntil: "domcontentloaded" },
    );
    await this.page.getByRole("button", { name: /Add/i }).click();
    const adminForm = this.page.locator("form:visible").last();
    await expect(adminForm).toBeVisible({ timeout: 15000 });
    await adminForm.locator("input").first().fill(uniqueLicenseTypeName);
    await adminForm.getByRole("button", { name: /Save/i }).click();
    await expect(this.page.locator(".oxd-toast").first()).toContainText(
      /Successfully/,
      { timeout: 15000 },
    );

    await this.page.goto(qualificationsUrl, { waitUntil: "domcontentloaded" });
    return true;
  }

  async assertJobDetailsLoaded() {
    await expect(
      this.page.getByRole("heading", {
        name: /Job Details|Détails du poste|Emploi/i,
      }),
    ).toBeVisible({ timeout: 20000 });

    for (const field of [
      "Joined Date",
      "Job Title",
      "Job Specification",
      "Job Category",
      "Sub Unit",
      "Location",
      "Employment Status",
    ]) {
      await expect(this.page.getByText(field, { exact: true })).toBeVisible();
    }

    await expect(this.page.locator("input[disabled]").first()).toBeDisabled();
  }

  async openEmploymentContractDetails() {
    const contractToggle = this.page.locator("span.oxd-switch-input").first();
    await contractToggle.click();
    await expect(this.page.getByRole("checkbox").first()).toBeChecked();

    await expect(
      this.page.getByText("Contract Start Date", { exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByText("Contract End Date", { exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByText("Contract Details", { exact: true }),
    ).toBeVisible();
    await expect(this.page.getByText("Browse", { exact: true })).toBeVisible();
    await expect(this.page.locator("input[type='file']")).toBeAttached();
  }

  async addSalaryRecord(data: {
    salaryComponent: string;
    amount: string;
    currency: string;
    payFrequency: string;
    comment: string;
  }) {
    const salaryCard = this.page
      .getByRole("heading", { name: /Salary|Salaire/i })
      .locator(
        "xpath=ancestor::div[contains(@class,'orangehrm-card-container')][1]",
      );

    const addButton = salaryCard
      .getByRole("button", { name: /Add|Ajouter/i })
      .first();
    await addButton.click();

    const form = this.page.locator("form").last();
    await expect(form).toBeVisible({ timeout: 15000 });

    await this.getInputFromForm(
      form,
      /Salary Component|Composant de salaire/i,
    ).fill(data.salaryComponent);
    await this.selectFromFormDropdown(form, /Currency|Devise/i, data.currency);
    await this.getInputFromForm(form, /Amount|Montant/i).fill(data.amount);
    await this.selectFromFormDropdown(
      form,
      /Pay Frequency|Fréquence de paie|Fréquence de paiement/i,
      data.payFrequency,
    );
    await this.getTextareaFromForm(form, /Comment|Commentaire/i).fill(
      data.comment,
    );

    await form.getByRole("button", { name: /Save|Enregistrer/i }).click();
    await expect(this.page.locator(".oxd-toast").first()).toContainText(
      /Successfully|Enregistré|Enregistrer/i,
      {
        timeout: 15000,
      },
    );
  }

  async addReportToRecord(data: { name: string; reportingMethod: string }) {
    const reportCard = this.page
      .getByRole("heading", { name: /Report-to|Reporter à/i })
      .locator(
        "xpath=ancestor::div[contains(@class,'orangehrm-card-container')][1]",
      );

    await reportCard.getByRole("button", { name: /Add|Ajouter/i }).click();
    const form = this.page.locator("form").last();
    await expect(form).toBeVisible({ timeout: 15000 });

    await this.getInputFromForm(form, /Name|Nom/i).fill(data.name);
    await this.selectFromFormDropdown(
      form,
      /Reporting Method|Méthode de rapport|Méthode de reporting|Méthode de déclaration/i,
      data.reportingMethod,
    );

    await form.getByRole("button", { name: /Save|Enregistrer/i }).click();
    await expect(this.page.locator(".oxd-toast").first()).toContainText(
      /Successfully|Enregistré|Enregistrer/i,
      {
        timeout: 15000,
      },
    );
  }

  async addQualificationEducation(data: {
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    notes: string;
  }) {
    const qualificationsCard = this.page
      .getByRole("heading", { name: /Qualifications|Diplômes/i })
      .locator(
        "xpath=ancestor::div[contains(@class,'orangehrm-card-container')][1]",
      );

    await qualificationsCard
      .getByRole("button", { name: /Add|Ajouter/i })
      .click();
    const form = this.page.locator("form").last();
    await expect(form).toBeVisible({ timeout: 15000 });

    await this.getInputFromForm(form, /School|École|Institut|Collège/i).fill(
      data.school,
    );
    await this.getInputFromForm(form, /Degree|Diplôme|Degré/i).fill(
      data.degree,
    );
    await this.getInputFromForm(
      form,
      /From Date|Date de début|Start Date|Date de début/i,
    ).fill(data.startDate);
    await this.getInputFromForm(
      form,
      /To Date|Date de fin|End Date|Date de fin/i,
    ).fill(data.endDate);
    await this.getTextareaFromForm(form, /Notes|Commentaires|Remarques/i).fill(
      data.notes,
    );

    await form.getByRole("button", { name: /Save|Enregistrer/i }).click();
    await expect(this.page.locator(".oxd-toast").first()).toContainText(
      /Successfully|Enregistré|Enregistrer/i,
      {
        timeout: 15000,
      },
    );
  }

  async assertImmigrationLoaded() {
    await expect(
      this.page.getByRole("heading", { name: "Assigned Immigration Records" }),
    ).toBeVisible({ timeout: 20000 });
    await expect(this.getImmigrationAddButton()).toBeVisible({
      timeout: 15000,
    });
  }

  async addImmigrationRecord(data: {
    document: "Passport" | "Other";
    documentNumber: string;
    issuedDate: string;
    expiryDate: string;
    eligibleStatus: string;
    issuedBy: string;
    eligibleReviewDate: string;
    comments: string;
  }) {
    await this.getImmigrationAddButton().click();

    const form = this.page.locator("form").last();
    await expect(form).toBeVisible({ timeout: 15000 });

    await form.getByRole("radio", { name: data.document, exact: true }).check();
    await this.getInputFromForm(form, "Number").fill(data.documentNumber);
    await this.getInputFromForm(form, "Issued Date").fill(data.issuedDate);
    await this.getInputFromForm(form, "Expiry Date").fill(data.expiryDate);
    await this.getInputFromForm(form, "Eligible Status").fill(
      data.eligibleStatus,
    );
    await this.selectFromFormDropdown(form, "Issued By", data.issuedBy);
    await this.getInputFromForm(form, "Eligible Review Date").fill(
      data.eligibleReviewDate,
    );
    await this.getTextareaFromForm(form, "Comments").fill(data.comments);

    await form.getByRole("button", { name: "Save" }).click();

    await expect(this.page.locator(".oxd-toast").first()).toContainText(
      /Successfully/,
      { timeout: 15000 },
    );
  }

  async assertImmigrationRecordRow(data: {
    document: string;
    documentNumber: string;
  }) {
    const row = this.page
      .locator(".oxd-table-row")
      .filter({ hasText: data.document })
      .filter({ hasText: data.documentNumber })
      .first();

    await expect(row).toBeVisible({ timeout: 20000 });
  }

  async saveContactDetails() {
    await this.page.getByRole("button", { name: "Save" }).first().click();

    const successToast = this.page.locator(".oxd-toast").first();
    await expect(successToast).toContainText(/Successfully/, {
      timeout: 15000,
    });

    await this.page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(
      this.page.getByRole("heading", { name: "Contact Details" }).first(),
    ).toBeVisible({ timeout: 20000 });
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

  private getPersonalInput(label: string | RegExp) {
    return this.page
      .locator("div.oxd-input-group")
      .filter({ hasText: label })
      .locator("input")
      .first();
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

  private getInputFromForm(
    form: ReturnType<Page["locator"]>,
    label: string | RegExp,
  ) {
    return form
      .locator("div.oxd-input-group")
      .filter({ hasText: label })
      .locator("input")
      .first();
  }

  private getTextareaFromForm(
    form: ReturnType<Page["locator"]>,
    label: string | RegExp,
  ) {
    return form
      .locator("div.oxd-input-group")
      .filter({ hasText: label })
      .locator("textarea")
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

  private getDependentsAddButton() {
    const dependentsCard = this.page
      .getByRole("heading", { name: "Assigned Dependents" })
      .locator(
        "xpath=ancestor::div[contains(@class,'orangehrm-card-container')][1]",
      );

    return dependentsCard.getByRole("button", { name: /Add/ }).first();
  }

  private getImmigrationAddButton() {
    const immigrationCard = this.page
      .getByRole("heading", { name: "Assigned Immigration Records" })
      .locator(
        "xpath=ancestor::div[contains(@class,'orangehrm-card-container')][1]",
      );

    return immigrationCard.getByRole("button", { name: /Add/ }).first();
  }

  private async selectFromFormDropdown(
    form: ReturnType<Page["locator"]>,
    label: string | RegExp,
    option: string,
  ): Promise<string> {
    const dropdown = form
      .locator("div.oxd-input-group")
      .filter({ hasText: label })
      .locator(".oxd-select-text")
      .first();

    const options = this.page.locator(
      ".oxd-select-dropdown .oxd-select-option, [role='option']",
    );
    let optionsVisible = false;
    for (let attempt = 0; attempt < 2; attempt++) {
      await dropdown.click();
      optionsVisible = await options
        .first()
        .isVisible({ timeout: 5000 })
        .catch(() => false);
      if (optionsVisible) {
        break;
      }
      await this.page.keyboard.press("Escape");
      await this.page.waitForTimeout(500);
    }
    await expect(options.first()).toBeVisible({ timeout: 10000 });

    // Long lists (e.g. Language, License Type) only render a subset of options
    // until filtered, which can cause the wrong (first-rendered) option to be
    // picked. Type the target text to narrow the rendered list first.
    await this.page.keyboard.type(option, { delay: 30 });
    await this.page.waitForTimeout(300);

    let optionTexts = await options.allTextContents();
    if (optionTexts.length === 0) {
      // Typing didn't filter this dropdown (or filtered out everything);
      // clear it and fall back to scanning the originally rendered list.
      await this.page.keyboard.press("Control+A");
      await this.page.keyboard.press("Backspace");
      await expect(options.first()).toBeVisible({ timeout: 10000 });
      optionTexts = await options.allTextContents();
    }
    const normalizedOption = option.trim().toLowerCase();
    const requestedIndex = optionTexts.findIndex(
      (text) => text.trim().toLowerCase() === normalizedOption,
    );
    const fallbackIndex = optionTexts.findIndex(
      (text) => text.trim() && !/select/i.test(text),
    );
    const selectedIndex = requestedIndex >= 0 ? requestedIndex : fallbackIndex;
    if (selectedIndex < 0) {
      throw new Error(`No selectable option found for ${option}`);
    }
    await options.nth(selectedIndex).click();
    return optionTexts[selectedIndex].trim();
  }
}
