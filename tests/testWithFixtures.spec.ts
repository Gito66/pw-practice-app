import {test} from '../test-options'
import {faker} from '@faker-js/faker'

// test.beforeEach(async ({page}) => {
//     await page.goto('/')
// })
test('parametrized methods', async({pageManager}) => {
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

    // await pm.navigationTo().formLayoutsPage()
    await pageManager.onFormLayoutPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAMED, process.env.PASSWORD, 'Option 1')
    await pageManager.onFormLayoutPage().submitInLineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
})