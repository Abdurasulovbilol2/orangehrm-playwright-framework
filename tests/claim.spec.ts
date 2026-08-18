import { test } from "@playwright/test";
import { ClaimPage } from "../pages/ClaimPage";
import { LoginPage } from "../pages/LoginPage";

test("fill claim request form", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");

  const claimPage = new ClaimPage(page);
  await claimPage.openClaimPage();

  const claim = {
    employeeName: "Steven Conway",
    event: "Accommodation",
    currency: "United States Dollar",
    remarks: `Automation claim request ${Date.now()}`,
  };

  await claimPage.fillEmployeeName(claim.employeeName);
  await claimPage.selectEvent(claim.event);
  await claimPage.selectCurrency(claim.currency);
  await claimPage.fillRemarks(claim.remarks);
  await claimPage.assertFormValues(claim);
});
