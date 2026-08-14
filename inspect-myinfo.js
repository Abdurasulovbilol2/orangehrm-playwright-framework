const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      { waitUntil: "domcontentloaded", timeout: 60000 },
    );
    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/dashboard/, { timeout: 30000 });
    await page.locator('a[href*="viewMyDetails"]').click();
    await page.waitForURL(/viewPersonalDetails/, { timeout: 30000 });
    await page.waitForTimeout(3000);

    const link = page
      .getByRole("link", { name: /Qualifications|Diplômes|Diplôme/i })
      .first();
    console.log("QUAL_VISIBLE", await link.isVisible().catch(() => false));
    await link.click();
    await page.waitForURL(/viewQualifications/, { timeout: 30000 });
    await page.waitForTimeout(2000);
    console.log("URL_AFTER_CLICK", page.url());

    const section = page
      .getByRole("heading", { name: /Work Experience/i })
      .locator(
        "xpath=ancestor::div[contains(@class,'orangehrm-card-container')][1]",
      );
    const addButton = section.getByRole("button", { name: /Add/i }).first();
    console.log("ADD_VISIBLE", await addButton.isVisible().catch(() => false));
    await addButton.click();
    await page.waitForTimeout(2000);

    const form = page.locator("form").last();
    console.log("FORM_VISIBLE", await form.isVisible().catch(() => false));
    console.log("FORM_COUNT", await page.locator("form").count());
    console.log("FORM_TEXT", (await form.innerText()).slice(0, 4000));
    console.log(
      "LABELS",
      JSON.stringify(
        (await page.locator("label").allTextContents()).slice(0, 200),
      ),
    );
    for (const name of [
      "Work Experience",
      "Education",
      "Skills",
      "Languages",
      "License",
    ]) {
      const heading = page.getByRole("heading", { name, exact: true }).first();
      console.log(
        "SECTION_INFO",
        name,
        await heading
          .evaluate((element) => {
            const parent = element.parentElement;
            const card = element.closest("div.orangehrm-card-container");
            return {
              tag: element.tagName,
              parentClass: parent?.className,
              cardClass: card?.className,
              cardText: card?.textContent?.slice(0, 120),
            };
          })
          .catch(() => null),
      );
    }
    console.log("BODY_START");
    console.log((await page.locator("body").innerText()).slice(0, 5000));
    console.log("BODY_END");
  } finally {
    await browser.close();
  }
})();
