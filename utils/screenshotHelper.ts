export async function takeScreenshot(page: any, name: string) {
  await page.screenshot({
    path: `screenshots/${name}.png`,
    fullPage: true,
    type: "png",
    quality: 100,
    captureBeyondViewport: true,
    animations: "disabled",
    timeout: 10000,
  });
}
