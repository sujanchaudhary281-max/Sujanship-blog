import { chromium } from 'playwright'

const OUT = 'C:/Users/HP/Desktop/sujan_blog/blog_app/.shots'
const routes = [['home','/'], ['mern','/mern']]
const sizes = [['mobile',375,812], ['desktop',1440,900]]

const browser = await chromium.launch()
for (const [rn, path] of routes) {
  for (const [sn, w, h] of sizes) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } })
    const page = await ctx.newPage()
    await page.goto('http://localhost:4173' + path, { waitUntil: 'networkidle', timeout: 30000 }).catch(()=>{})
    await page.waitForTimeout(2500)
    await page.screenshot({ path: `${OUT}/${rn}-${sn}.png`, fullPage: true })
    console.log(`${rn}-${sn} done`)
    await ctx.close()
  }
}
await browser.close()
