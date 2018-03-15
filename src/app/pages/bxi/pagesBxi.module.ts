
import { SesionBxiService } from './sesion-bxi.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransferenciaFinishSpeiComponent } from './transferencia-spei/transferencia-finish-spei/transferencia-finish-spei.component';
import { NgModule } from "@angular/core"; 
import { PagesBxiComponent } from './PagesBxi.component';
import { PAGES_ROUTES_BXI } from './pagesBxi.routes';
import { SharedModule } from '../../shared/shared.module';
import { CompraTaComponent } from "./compra-ta/compra-ta.component";
import { TransferenciaSpeiComponent } from './transferencia-spei/transferencia-spei.component';
import { MenuBxiComponent } from './menu-bxi/menu-bxi.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { IKeyboardLayouts, keyboardLayouts, MAT_KEYBOARD_LAYOUTS, MatKeyboardModule, KeyboardClassKey } from '@ngx-material-keyboard/core';
import { PagoServiciosIniComponent } from './pago-servicios/pago-servicios-ini/pago-servicios-ini.component';
import { PagoServiciosDetailComponent } from './pago-servicios/pago-servicios-detail/pago-servicios-detail.component';
import { PagoServiciosVerifyComponent } from './pago-servicios/pago-servicios-verify/pago-servicios-verify.component';

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


@NgModule ({
    declarations: [
        
        PagesBxiComponent,
        CompraTaComponent,
        TransferenciaSpeiComponent,
        TransferenciaFinishSpeiComponent,
        MenuBxiComponent,
        PagoServiciosIniComponent,
        PagoServiciosDetailComponent,
        PagoServiciosVerifyComponent,

        
        
    ],
    exports: [],
    imports: [
        SharedModule,
        PAGES_ROUTES_BXI,
        CommonModule,
        FormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatKeyboardModule,

        
    ],
    providers: [ SesionBxiService,  { provide: MAT_KEYBOARD_LAYOUTS, useValue: customLayouts}],
})

export class PagesBxiModule {} 
