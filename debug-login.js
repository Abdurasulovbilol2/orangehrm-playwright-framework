const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on("response", (r) => {
    if (r.url().includes("orangehrmlive")) {
      console.log("RESP", r.status(), r.url());
    }
  });

  try {
    const response = await page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      },
    );
    console.log("goto status", response && response.status());
    console.log("final URL", page.url());
    console.log("title", await page.title());
    console.log("content length", (await page.content()).length);
    console.log((await page.content()).slice(0, 8000));
  } catch (e) {
    console.error("ERR", e);
  } finally {
    await browser.close();
  }
})();
