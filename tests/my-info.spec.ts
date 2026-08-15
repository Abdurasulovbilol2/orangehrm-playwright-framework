import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MyInfoPage } from "../pages/MyInfoPage";

test("open my info and verify personal details", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");

  const myInfoPage = new MyInfoPage(page);
  await myInfoPage.openMyInfoPage();
  await myInfoPage.assertPersonalDetailsLoaded();

  const updatedDetails = {
    firstName: "Bilol",
    middleName: "Abdurasul",
    lastName: "Abdurasul",
  };
  const updatedEmployeeId = String(Date.now()).slice(-6);
  const updatedOtherId = "56789";
  const updatedDriversLicense = "101112";
  const updatedLicenseExpiry = "2025-31-12";
  const updatedNationality = "Uzbekistan";
  const updatedMaritalStatus = "Single";
  const updatedDateOfBirth = "2005-24-02";
  const updatedGender = "Male" as const;

  await myInfoPage.fillPersonalNameDetails(updatedDetails);
  await myInfoPage.fillEmployeeId(updatedEmployeeId);
  await myInfoPage.fillOtherId(updatedOtherId);
  await myInfoPage.fillDriversLicense(updatedDriversLicense);
  await myInfoPage.fillLicenseExpiryDate(updatedLicenseExpiry);
  await myInfoPage.selectNationality(updatedNationality);
  await myInfoPage.selectMaritalStatus(updatedMaritalStatus);
  await myInfoPage.fillDateOfBirth(updatedDateOfBirth);
  await myInfoPage.selectGender(updatedGender);

  await myInfoPage.assertPersonalNameDetails(updatedDetails);
  await myInfoPage.assertEmployeeId(updatedEmployeeId);
  await myInfoPage.assertOtherId(updatedOtherId);
  await myInfoPage.assertDriversLicense(updatedDriversLicense);
  await myInfoPage.assertLicenseExpiryDate(updatedLicenseExpiry);
  await myInfoPage.assertNationality(updatedNationality);
  await myInfoPage.assertMaritalStatus(updatedMaritalStatus);
  await myInfoPage.assertDateOfBirth(updatedDateOfBirth);
  await myInfoPage.assertGender(updatedGender);

  await myInfoPage.savePersonalDetails();
});

test("fill all qualification forms", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");

  const myInfoPage = new MyInfoPage(page);
  await myInfoPage.openMyInfoPage();
  await myInfoPage.openQualificationsSection();

  await myInfoPage.fillQualificationWorkExperience({
    company: "TCS",
    jobTitle: "Tester",
    fromDate: "2020-09-02",
    toDate: "2023-07-16",
    comment: "Automation qualification work experience",
  });

  await myInfoPage.fillQualificationEducation({
    level: "College Undergraduate",
    institute: "Oxford University",
    major: "Computer Science",
    gpaScore: "3.8",
    endDate: "2023-31-12",
    year: "2023",
  });

  await myInfoPage.fillQualificationSkill({
    skill: "Content Creation",
    yearsOfExperience: "3",
  });

  await myInfoPage.fillQualificationLanguage({
    language: "english",
    fluency: "Writing",
    competency: "Good",
    comments: "Automation language entry",
  });

  await myInfoPage.fillQualificationLicense({
    licenseType: "Certified Digital Marketing Professional (CDMP)",
    licenseNumber: "CDMP-2021-001",
    issuedDate: "2021-01-05",
    expiryDate: "2031-01-05",
  });
});

test("fill and save a membership form", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");

  const myInfoPage = new MyInfoPage(page);
  await myInfoPage.openMyInfoPage();
  await myInfoPage.openMembershipsSection();

  await myInfoPage.fillMembership({
    membership: "Gym Membership",
    paidBy: "Company",
    amount: "100",
    currency: "USD",
    commencementDate: "2025-01-01",
    renewalDate: "2026-01-01",
  });
});

test("open salary page", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");

  const myInfoPage = new MyInfoPage(page);
  await myInfoPage.openMyInfoPage();
  await myInfoPage.openSalarySection();
  await expect(
    page.getByRole("heading", { name: /Salary|Salaire/i }).first(),
  ).toBeVisible();
});

test("open report-to page", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");

  const myInfoPage = new MyInfoPage(page);
  await myInfoPage.openMyInfoPage();
  await myInfoPage.openReportToSection();
  await expect(
    page
      .getByRole("heading", { name: /Report to|Assigned Supervisors/i })
      .first(),
  ).toBeVisible();
});
