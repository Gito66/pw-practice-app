import {test, expect} from '@playwright/test'

//Usando test, el primer parametro es el nombre del test y el segundo es una funcion que contiene el test, se pueden agrupar varios test
//en grupos usando test.describe y metiendo dentro de este los test que se quieran agrupar
//skip es para saltar el test, only es para ejecutar solo ese test
test.beforeEach(async ({page}) => {
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async ({page}) =>{
    //By tag name
    await page.locator('input').first().click()//Sin el first existen 20 inputs, no coge ninguno y da ideas para filtrar, con first coge el primero

    //By id
    await page.locator('#inputEmail1').click()

    //By class value
    page.locator('.shape-rectangle')

    //By attribute
    page.locator('[placeholder="Email"]')

    //By class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition cdk-focused cdk-mouse-focused"]')

    //Combine different selectors (Importante no va con separacion alguna)
    page.locator('input[placeholder="Email"].shape-rectangle')

    //By XPAath (Not recommended)
    page.locator('//*[@id="inputEmail1"]')

    //By partial text match
    page.locator(':text("Using")')

    //By exact text match
    page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()
    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    await page.getByTitle('IoT Dashboard').click()

    await page.getByTestId('SignIn').click()
})

test('locating child elements', async({page}) =>{
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    //Otra forma de concatenarlo es:
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()
    
    //nth sirve para tomar un indice, es decir coge la nb-card nº3 0,1,2,3.... no muy recomendable
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('locating parent elements', async({page}) =>{
    await page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()

    //Not recomended
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})

test('reusing the locators', async ({ page }) => {
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" });
    const emailField = basicForm.getByRole('textbox', { name: "Email" })

    await emailField.fill("test@test.com");
    await basicForm.getByRole('textbox', { name: "Password" }).fill("Welcome123");
    await basicForm.locator('nb-checkbox').click();
    await basicForm.getByRole('button').click();

    await expect(emailField).toHaveValue("test@test.com");
})

test('extracting values', async ({ page }) => {
    //Single test value
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" });
    const buttonText = await basicForm.locator('button').textContent();
    expect(buttonText).toEqual("Submit");

    //All test values, coge una seleccion de todos los textos de los botones y comprueba si contiene el texto "Submit" alguno
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents();
    expect(allRadioButtonsLabels).toContain("Option 1");

    //input value
    const emailField = basicForm.getByRole('textbox', { name: "Email" });
    await emailField.fill('test@test.com');
    const emailValue = await emailField.inputValue();
    expect(emailValue).toEqual('test@test.com');

    //Attribute value test
    const placeholderValue = await emailField.getAttribute('placeholder');
    expect(placeholderValue).toEqual('Email');
})

test('assertions', async ({ page }) => {
    const basicFormButton = page.locator('nb-card').filter({ hasText: "Basic form" }).locator('button');

    //General assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent();
    expect(text).toEqual("Submit");

    //Locators assertions
    await expect(basicFormButton).toHaveText("Submit");

    //Soft assertions (Continua con el test aunque falle), no es buena practica
    await expect.soft(basicFormButton).toHaveText("Submit5");
    await basicFormButton.click();
})