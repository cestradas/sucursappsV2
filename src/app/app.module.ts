/// <reference path="../../node_modules/cordova-plugin-mfp/typings/worklight.d.ts" />

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';

import { APP_ROUTES } from './app.routes';
import { LoginComponent } from './login/login.component';
import { PagesModule } from './pages/pages.module';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    FormsModule,
    PagesModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
