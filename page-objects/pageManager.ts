import { Page, expect } from "@playwright/test";
import { NavigationPage } from '../page-objects/navigationPage'
import { formLayoutsPage } from '../page-objects/formLayoutsPage'
import { datepickerPage } from '../page-objects/datepickerPage'

export class pageManager{
    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly formLayoutsPage: formLayoutsPage
    private readonly datepickerPage: datepickerPage

    constructor(page: Page){
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.formLayoutsPage = new formLayoutsPage(this.page)
        this.datepickerPage = new datepickerPage(this.page)
    }
    navigationTo(){
        return this.navigationPage
    }
    onFormLayoutPage(){
        return this.formLayoutsPage
    }
    onDatePickerPage(){
        return this.datepickerPage
    }
}