
/// <reference path="../../node_modules/cordova-plugin-mfp/typings/worklight.d.ts" />
import { SesionBxiService } from './pages/bxi/sesion-bxi.service';
import { LoginBxiComponent } from './pages/bxi/login-bxi/login-bxi.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_ROUTES } from './app.routes';
import { LoginComponent } from './login/login.component';
import { PagesModule } from './pages/pages.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { IKeyboardLayouts, keyboardLayouts, MAT_KEYBOARD_LAYOUTS, MatKeyboardModule, KeyboardClassKey } from '@ngx-material-keyboard/core';
import { ServiceModule } from './services/service.module';

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
    AppComponent,
    LoginComponent,
    LoginBxiComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    FormsModule,
    PagesModule,
    HttpModule,
    AngularFontAwesomeModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatKeyboardModule,
    ServiceModule
  ],
  providers: [SesionBxiService, { provide: MAT_KEYBOARD_LAYOUTS, useValue: customLayouts}],
  bootstrap: [AppComponent]
})
export class AppModule { }
