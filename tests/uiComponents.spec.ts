import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto('/')
})

test.describe('Form Layouts page', () => {
    test.describe.configure({retries: 0})

    test.beforeEach(async ({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async ({page}, testInfo) => {
        if(testInfo.retry){
            //Do something
        }
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: "Email"})

        //Escribir en el input
        await usingTheGridEmailInput.fill('test@test.com')
        //Borrar el contenido del input
        await usingTheGridEmailInput.clear()
        //Escribir en el input de manera secuencial, con un intervalo de 100ms
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 100})
        
        //Generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //Loator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test.only('radio buttons', async ({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: 'Using the Grid'})

        //await usingTheGridForm.getByLabel('Option 1').check({force: true})
        await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).check({force: true})
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()
        await expect(usingTheGridForm).toHaveScreenshot()
        // expect(radioStatus).toBeTruthy()
        // await expect(usingTheGridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked()

        // await usingTheGridForm.getByLabel('Option 2').check({force: true})
        // expect(await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy()
        // expect(await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy()
        
        //await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check({force: true})
        //await expect(usingTheGridForm).toHaveScreenshot()
    })
})

test('checkboxes', async ({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', {name: 'Hide on click'}).click({force: true}) 
    //Se puede utilizar check para que no desmarque la casilla si esta ya marcada
    await page.getByRole('checkbox', {name: 'Hide on click'}).check({force: true})
    //De igual manera podemos usar uncheck para desmarcarla, este metodo es preferible
    await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force: true})

    //Hagamoslo en bucle ahora
    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()){ //Usamos el metodo all() para crear un aarray de todos los checkboxes
        await box.check({force: true})
        expect(await box.isChecked()).toBeTruthy()        
    }

    for (const box of await allBoxes.all()){ //Usamos el metodo all() para crear un aarray de todos los checkboxes
        await box.uncheck({force: true})
        expect(await box.isChecked()).toBeFalsy()        
    }
})

test ('list and dropdowns', async ({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    page.getByRole('list') //When the list has UL tag
    page.getByRole('listitem') //When the list has LI tag

    //const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText: 'Cosmic'}).click()

    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        "Light": 'rgb(255, 255, 255)',
        "Dark": 'rgb(34, 43, 69)',
        "Cosmic": 'rgb(50, 50, 89)',
        "Corporate": 'rgb(255, 255, 255)'
    }
    await dropDownMenu.click()
    for (const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if (color != "Corporate")
            await dropDownMenu.click()
    }
})

test('tooltips', async ({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', {hasText: 'Tooltip Placement'})
    await toolTipCard.getByRole('button', {name: "Top"}).hover()

    page.getByRole('tooltip') //Solo si tenemos un rol tooltip definido, ano aplica a este ejemplo

    const toolTip = await page.locator('nb-tooltip').textContent()
    expect(toolTip).toEqual('This is a tooltip')
})

test('dialog box', async ({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })
    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')

})

test('web tables', async ({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //1-Get the row by any test in this row
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"}) //Si es texto plano se puede buscar asi y devolvera la fila con ese texto
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear() //Al entrar en modo edicion pasa a ser un input, asi que lo buscamos por el placeholder
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()

    //2-Get the row based on the value in the specific columnç
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
        //Hay confusion entre la id 11 y la edad 11 aqui filtramos por la id, se utiliza nth para seleccionar un indice, es decir estamos cogiendo la columna 2(ID)
    const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')}) 
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    //3-Test filter of the table
    const ages = ["20", "30", "40", "200"]
    for (let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)

        const ageRows = page.locator('tbody tr')

        for(let row of await ageRows.all()){ //.all crea un array con todos los elementos que cumplan la condicion
            const cellValue = await row.locator('td').last().textContent()
            if (age =="200"){
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            } else {
                expect(cellValue).toEqual(age)
            }
        }
    }
})

test('date picker', async ({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    let date = new Date()
    date.setDate(date.getDate() + 40)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert =`${expectedMonthShort} ${expectedDate}, ${expectedYear}` //Jan 1, 2025

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`

    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    //getByText es una busqueda parcial no exacta, por eso usamos el flag exact
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('sliders', async ({page}) => {
    ////Update the attribute
    // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    // await tempGauge.evaluate(node => {
    //     node.setAttribute('cx', '232.630')
    //     node.setAttribute('cy', '232.630')
    // })
    // await tempGauge.click()

    //Mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y) //Posicionamos el raton en esta posicion (Centro del circulo)
    await page.mouse.down() //Click and hold
    await page.mouse.move(x + 100, y) //Move the mouse 100px to the right
    await page.mouse.move(x + 100, y + 100) //Move the mouse 100px down
    await page.mouse.up() //Release the click
    await expect(tempBox).toContainText('30')
})