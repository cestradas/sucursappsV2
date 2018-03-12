import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { PAGES_ROUTES } from './pages.routes';

import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        PagesComponent
    ],
    exports: [],
    imports: [
        SharedModule,
        PAGES_ROUTES
    ]
})

export class PagesModule {  }
