


import { NgModule} from '@angular/core';
import { PagesComponent } from './pages.component';
import { PAGES_ROUTES } from './pages.routes';

import { SharedModule } from '../shared/shared.module';

import { PagesTddModule } from './tdd/pagesTdd.module';
import { PagesBxiModule } from "./bxi/pagesBxi.module";
import { BreadcrumbsComponent } from '../shared/breadcrumbs/breadcrumbs.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';





@NgModule({
    declarations: [
        PagesComponent,
        BreadcrumbsComponent
        
    ],
    exports: [],
    imports: [
        SharedModule,
        PAGES_ROUTES,
        PagesTddModule,
        PagesBxiModule,
        AngularFontAwesomeModule
    ],
})

export class PagesModule {  }
