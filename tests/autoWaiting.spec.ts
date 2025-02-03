import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}, testInfo) => {
    await page.goto(process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000)
})

test('auto waiting', async ({page}) => {
    const successBotton = page.locator('.bg-success')
    
    //await successBotton.click()

    // const text = await successBotton.textContent()
    // await successBotton.waitFor({state: "attached"})
    // const text = await successBotton.allTextContents()

    // expect(text).toEqual('Data loaded with AJAX get request.')

    await expect(successBotton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test('alternative waits', async ({page}) => {
    const successBotton = page.locator('.bg-success')

    //Wait for element
    //await page.waitForSelector('.bg-success')

    //Wait for particular response
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //Wait for network calls to be completed(Not recomended)
    await page.waitForLoadState('networkidle')

    //Wait time you want
    //await page.waitForTimeout(5000)

    //Wait for url
    //await page.waitForURL('http://uitestingplayground.com/ajax')
    
    const text = await successBotton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test('timeouts', async ({page}) => {
    //test.setTimeout(10000)
    test.slow() //multiply by 3 the timeout
    const successBotton = page.locator('.bg-success')
    await successBotton.click({timeout: 16000})
})