const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();
  await page.setContent(
    require("fs").readFileSync("D:/LandInvest/docs/user-manual.html", "utf8"),
    { waitUntil: "networkidle0", timeout: 60000 }
  );
  await page.pdf({
    path: "D:/LandInvest/docs/LandInvest_User_Manual.pdf",
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: "18mm", bottom: "18mm", left: "16mm", right: "16mm" },
    pageRanges: "1-999",
  });
  await browser.close();
  console.log("PDF generated: D:/LandInvest/docs/LandInvest_User_Manual.pdf");
})().catch((e) => {
  console.error("PDF generation failed:", e);
  process.exit(1);
});
