import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MyInfoPage } from "../pages/MyInfoPage";

test("add emergency contact with all fields", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");

  const myInfoPage = new MyInfoPage(page);
  await myInfoPage.openMyInfoPage();
  await myInfoPage.openEmergencyContacts();
  await myInfoPage.assertEmergencyContactsLoaded();

  const testRunId = Date.now();
  const contact = {
    name: `Emergency ${testRunId}`,
    relationship: "Brother",
    homeTelephone: "020 7000 2222",
    mobile: "0777 333 444",
    workTelephone: "0777 555 888",
  };

  await myInfoPage.addEmergencyContact(contact);
  await myInfoPage.assertEmergencyContactRow({
    name: contact.name,
    relationship: contact.relationship,
  });
});
