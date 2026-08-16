import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { RecruitmentPage } from "../pages/RecruitmentPage";

test("fill and save the recruitment candidate form", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");

  const recruitmentPage = new RecruitmentPage(page);
  await recruitmentPage.openAddCandidatePage();

  const candidate = {
    firstName: "Bilol",
    middleName: "Test",
    lastName: `Candidate${Date.now()}`,
    email: `bilol.${Date.now()}@example.com`,
    contactNumber: "5551234567",
    keywords: "Playwright, TypeScript, QA",
    notes: "Recruitment form automation candidate",
  };

  await recruitmentPage.fillCandidateForm(candidate);
  await recruitmentPage.saveCandidate();
  await recruitmentPage.assertCandidateSaved(candidate);
});
