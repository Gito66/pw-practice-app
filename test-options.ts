import {test as base} from '@playwright/test'
import { pageManager } from '../pw-practice-app/page-objects/pageManager'

export type testOptions = {
    globalsQaURL: string
    formLayoutsPage: string
    pageManager: pageManager
}

export const test = base.extend<testOptions>({
    globalsQaURL: ['', {option:true}],

    formLayoutsPage: async({page}, use) => {
        await page.goto('/')
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
        await use('')
    },

    pageManager: async({page, formLayoutsPage}, use) =>{
        const pm = new pageManager(page)
        await use (pm)
    }
})