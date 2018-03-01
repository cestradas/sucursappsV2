import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { PAGES_ROUTES } from './pages.routes';
import { TddMenuComponent } from './tdd/tdd-menu/tdd-menu.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        PagesComponent,
        TddMenuComponent
    ],
    exports: [],
    imports: [
        SharedModule,
        PAGES_ROUTES
    ]
})

export class PagesModule {  }
