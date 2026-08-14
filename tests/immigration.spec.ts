import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MyInfoPage } from "../pages/MyInfoPage";

test("add immigration record with all fields", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");

  const myInfoPage = new MyInfoPage(page);
  await myInfoPage.openMyInfoPage();
  await myInfoPage.openImmigration();
  await myInfoPage.assertImmigrationLoaded();

  const testRunId = Date.now();
  const immigrationRecord = {
    document: "Passport" as const,
    documentNumber: `P${testRunId}`,
    issuedDate: "15-01-2024",
    expiryDate: "15-01-2034",
    eligibleStatus: "Eligible",
    issuedBy: "Uzbekistan",
    eligibleReviewDate: "15-01-2025",
    comments: "Automated immigration record test",
  };

  await myInfoPage.addImmigrationRecord(immigrationRecord);
  await myInfoPage.assertImmigrationRecordRow({
    document: immigrationRecord.document,
    documentNumber: immigrationRecord.documentNumber,
  });
});
