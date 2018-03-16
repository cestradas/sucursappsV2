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

const customLayouts: IKeyboardLayouts = {
    ...keyboardLayouts,
    'Numerico': {
      'name': 'NumPad',
      'keys': [
        [
          ['1', '!', '|'],
          ['2', '"', '@'],
          ['3', '\'', '#'],
          ['4', '$', '~']
        ],
        [
          ['5', '%', '\u20ac'],
          ['6', '&', '\u00ac'],
          ['7', '/'],
          ['8', '('],
        ],
        [
          ['9', ')'],
          ['0', '='],
          ['-', ';'],
          ['.', ':']
        ],
        [
          [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
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
