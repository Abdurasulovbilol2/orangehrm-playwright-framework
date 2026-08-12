import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MyInfoPage } from "../pages/MyInfoPage";

test("add dependent with all fields", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");

  const myInfoPage = new MyInfoPage(page);
  await myInfoPage.openMyInfoPage();
  await myInfoPage.openDependents();
  await myInfoPage.assertDependentsLoaded();

  const testRunId = Date.now();
  const dependent = {
    name: `Dependent ${testRunId}`,
    relationship: "Child" as const,
    dateOfBirth: "2015-10-21",
  };

  await myInfoPage.addDependent(dependent);
  await myInfoPage.assertDependentRow({
    name: dependent.name,
    relationship: dependent.relationship,
  });
});
