import { Page, expect } from "@playwright/test";

export class RecruitmentPage {
  private readonly addCandidateUrl =
    "https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/addCandidate";

  constructor(private page: Page) {}

  async openAddCandidatePage() {
    const recruitmentMenuItem = this.page.getByRole("link", {
      name: "Recruitment",
    });
    const isMenuVisible = await recruitmentMenuItem
      .isVisible({ timeout: 15000 })
      .catch(() => false);

    if (isMenuVisible) {
      await recruitmentMenuItem.click();
      await this.page.waitForLoadState("domcontentloaded");
      await this.page.getByRole("link", { name: "Candidates" }).first().click();
      await this.page.getByRole("button", { name: "Add" }).click();
    } else {
      await this.page.goto(this.addCandidateUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
    }

    await expect(this.page).toHaveURL(/recruitment\/addCandidate/, {
      timeout: 30000,
    });
    await expect(
      this.page.getByRole("heading", { name: "Add Candidate" }),
    ).toBeVisible({ timeout: 20000 });
  }

  async fillCandidateForm(data: {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    keywords: string;
    notes: string;
  }) {
    await this.page.locator("input[name='firstName']").fill(data.firstName);
    await this.page.locator("input[name='middleName']").fill(data.middleName);
    await this.page.locator("input[name='lastName']").fill(data.lastName);
    await this.page
      .locator("div.oxd-input-group:has(label:has-text('Email')) input")
      .fill(data.email);
    await this.page
      .locator(
        "div.oxd-input-group:has(label:has-text('Contact Number')) input",
      )
      .fill(data.contactNumber);
    await this.page
      .locator("div.oxd-input-group:has(label:has-text('Keywords')) input")
      .fill(data.keywords);
    await this.page
      .locator("div.oxd-input-group:has(label:has-text('Notes')) textarea")
      .fill(data.notes);

    const consent = this.page.locator("input[type='checkbox']").first();
    await expect(consent).toBeAttached({ timeout: 10000 });
    await consent.check({ force: true });
    await expect(consent).toBeChecked();
  }

  async saveCandidate() {
    await this.page.locator("button[type='submit']").click();
  }

  async assertCandidateSaved(data: {
    firstName: string;
    lastName: string;
    email: string;
  }) {
    await expect(this.page).toHaveURL(/recruitment\/addCandidate/, {
      timeout: 30000,
    });
    await expect(this.page.locator("input[name='firstName']")).toHaveValue(
      data.firstName,
    );
    await expect(this.page.locator("input[name='lastName']")).toHaveValue(
      data.lastName,
    );
    await expect(
      this.page.locator(
        "div.oxd-input-group:has(label:has-text('Email')) input",
      ),
    ).toHaveValue(data.email);
  }
}
