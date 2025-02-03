import {test, expect} from '@playwright/test'
import { pageManager } from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'

test.beforeEach(async ({page}) => {
    await page.goto('/')
})

test('navigate to form page @smoke @regresion', async ({page}) => {
    const pm = new pageManager(page)
    await pm.navigationTo().formLayoutsPage()
    await pm.navigationTo().datepickerPage()
    await pm.navigationTo().smartTablePage()
    await pm.navigationTo().toastrPage()
    await pm.navigationTo().tooltipPage()
})

test('parametrized methods @smoke', async({page}) => {
    const pm = new pageManager(page)

    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

    await pm.navigationTo().formLayoutsPage()
    await pm.onFormLayoutPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAMED, process.env.PASSWORD, 'Option 1')
    await pm.onFormLayoutPage().submitInLineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
    // await pm.navigationTo().datepickerPage()
    // await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5)
    // await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(6, 15)
})