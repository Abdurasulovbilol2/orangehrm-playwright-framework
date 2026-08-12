import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MyInfoPage } from "../pages/MyInfoPage";

test("update all contact details fields", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");

  const myInfoPage = new MyInfoPage(page);
  await myInfoPage.openMyInfoPage();
  await myInfoPage.openContactDetails();
  await myInfoPage.assertContactDetailsLoaded();

  const testRunId = Date.now();
  const contactDetails = {
    street1: "221B Baker Street",
    street2: "Flat B",
    city: "London",
    stateProvince: "Greater London",
    zipPostalCode: "NW16XE",
    country: "United Kingdom",
    homePhone: "020 7000 1111",
    mobilePhone: "0777 111 222",
    workPhone: "0777 555 888",
    workEmail: `paul1+${testRunId}@osohrm.com`,
    otherEmail: `contact.${testRunId}@example.com`,
  };

  await myInfoPage.fillContactDetailsForm(contactDetails);
  await myInfoPage.assertContactDetailsForm(contactDetails);
  await myInfoPage.saveContactDetails();

  // Re-check after save to ensure all values remain in the form
  await myInfoPage.assertContactDetailsForm(contactDetails);
});
