import { Page, expect } from "@playwright/test";

export class ClaimPage {
  private readonly claimUrl =
    "https://opensource-demo.orangehrmlive.com/web/index.php/claim/assignClaim";

  constructor(private page: Page) {}

  async openClaimPage() {
    const claimMenuItem = this.page.getByRole("link", { name: "Claim" });
    const isClaimMenuVisible = await claimMenuItem
      .isVisible({ timeout: 15000 })
      .catch(() => false);

    if (isClaimMenuVisible) {
      await claimMenuItem.click();
      await this.page.waitForLoadState("domcontentloaded");
    } else {
      await this.page.goto(this.claimUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
    }

    await expect(this.page).toHaveURL(/claim\/(assignClaim|viewAssignClaim)/, {
      timeout: 30000,
    });

    const assignClaimLink = this.page.getByRole("link", {
      name: "Assign Claim",
      exact: true,
    });
    if (await assignClaimLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await assignClaimLink.click();
      await this.page.waitForLoadState("domcontentloaded");
    }

    await expect(
      this.page.getByText("Create Claim Request", { exact: true }),
    ).toBeVisible({
      timeout: 30000,
    });
  }

  private field(label: string) {
    return this.page
      .locator("div.oxd-input-group")
      .filter({ has: this.page.getByText(label, { exact: true }) });
  }

  async fillEmployeeName(name: string) {
    const employeeField = this.field("Employee Name");
    const input = employeeField.locator(
      "input[placeholder='Type for hints...']",
    );
    await input.fill(name);

    const suggestion = this.page
      .getByRole("option")
      .filter({ hasText: name })
      .first();
    if (await suggestion.isVisible({ timeout: 5000 }).catch(() => false)) {
      await suggestion.click();
    }

    await expect(input).toHaveValue(name);
  }

  async selectEvent(event: string) {
    await this.field("Event").locator(".oxd-select-text").click();
    await this.page.getByRole("option", { name: event, exact: true }).click();
  }

  async selectCurrency(currency: string) {
    await this.field("Currency").locator(".oxd-select-text").click();
    await this.page
      .getByRole("option", { name: currency, exact: true })
      .click();
  }

  async fillRemarks(remarks: string) {
    await this.field("Remarks").locator("textarea").fill(remarks);
  }

  async assertFormValues(values: {
    employeeName: string;
    event: string;
    currency: string;
    remarks: string;
  }) {
    await expect(this.field("Employee Name").locator("input")).toHaveValue(
      values.employeeName,
    );
    await expect(
      this.field("Event").locator(".oxd-select-text-input"),
    ).toHaveText(values.event);
    await expect(
      this.field("Currency").locator(".oxd-select-text-input"),
    ).toHaveText(values.currency);
    await expect(this.field("Remarks").locator("textarea")).toHaveValue(
      values.remarks,
    );
  }
}
