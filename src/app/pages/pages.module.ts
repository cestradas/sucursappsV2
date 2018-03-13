import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { PAGES_ROUTES } from './pages.routes';

import { SharedModule } from '../shared/shared.module';

import { PagesTddModule } from './tdd/pagesTdd.module';
import { MenuBxiComponent } from './bxi/menu-bxi/menu-bxi.component';
import { MenutddComponent } from './tdd/menuTDD/menutdd.component';
import { BreadcrumbsComponent } from '../shared/breadcrumbs/breadcrumbs.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
    declarations: [
        PagesComponent,
        MenutddComponent,
        MenuBxiComponent,
        BreadcrumbsComponent
    ],
    exports: [],
    imports: [
        SharedModule,
        PAGES_ROUTES,
        PagesTddModule,
        AngularFontAwesomeModule
    ]
})

export class PagesModule {  }
