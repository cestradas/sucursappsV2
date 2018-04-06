import { SesionBxiService } from './bxi/sesion-bxi.service';
import { FormsModule } from '@angular/forms';
import { NgModule} from '@angular/core';
import { PagesComponent } from './pages.component';
import { PAGES_ROUTES } from './pages.routes';

import { SharedModule } from '../shared/shared.module';

import { PagesTddModule } from './tdd/pagesTdd.module';
import { PagesBxiModule } from "./bxi/pagesBxi.module";
import { BreadcrumbsComponent } from '../shared/breadcrumbs/breadcrumbs.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { IKeyboardLayouts, keyboardLayouts, MAT_KEYBOARD_LAYOUTS, MatKeyboardModule, KeyboardClassKey } from '@ngx-material-keyboard/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

const customLayouts: IKeyboardLayouts = {
  ...keyboardLayouts,
  'Numerico': {
    'name': 'NumPad',
    'keys': [
      [
        ['9'],
        ['8'],
        ['7'],
        [KeyboardClassKey.Bksp]
      ],
      [
        ['6' ],
        ['5'],
        ['4'],
        ['.'],
      ],
      [
        ['3'],
        ['2'],
        ['1'],
        ['-']
      ],
      [
        ['0'],
        [KeyboardClassKey.Space],
      ]
    ],
    'lang': ['num']
  }
};






@NgModule({
    declarations: [
        PagesComponent,
        BreadcrumbsComponent
        
    ],
    exports: [],
    imports: [
        SharedModule,
        CommonModule,
        BrowserModule,
        PAGES_ROUTES,
        PagesTddModule,
        PagesBxiModule,
        AngularFontAwesomeModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatKeyboardModule,
    ],
    providers: [SesionBxiService, { provide: MAT_KEYBOARD_LAYOUTS, useValue: customLayouts}],
 
})

export class PagesModule {  }
