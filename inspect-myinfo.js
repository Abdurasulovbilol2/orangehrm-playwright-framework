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

    const sections = [
      { name: "Salary", pattern: /Salary|Salaire/i },
      { name: "Report-to", pattern: /Report-to|Reporter à/i },
      {
        name: "Qualifications",
        pattern: /Qualifications|Diplômes|Diplome|Diplôme/i,
      },
    ];

    for (const section of sections) {
      const link = page.getByRole("link", { name: section.pattern }).first();
      const visible = await link.isVisible().catch(() => false);
      console.log("SECTION", section.name, "VISIBLE", visible);
      if (visible) {
        await link.click();
        await page.waitForTimeout(2000);
        console.log("AFTER CLICK URL", page.url());
        console.log(
          "AFTER CLICK BODY",
          (await page.locator("body").innerText()).slice(0, 1500),
        );
      }
    }

    const bodyText = await page.locator("body").innerText();
    console.log("---BODY START---");
    console.log(bodyText.slice(0, 2500));
    console.log("---BODY END---");
  } finally {
    await browser.close();
  }
})();
