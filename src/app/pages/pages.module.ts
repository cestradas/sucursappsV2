import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { PAGES_ROUTES } from './pages.routes';

import { SharedModule } from '../shared/shared.module';
import { MenutddComponent } from './tdd/menuTDD/menutdd/menutdd.component';

@NgModule({
    declarations: [
        PagesComponent,
        MenutddComponent
    ],
    exports: [],
    imports: [
        SharedModule,
        PAGES_ROUTES
    ]
})

export class PagesModule {  }
