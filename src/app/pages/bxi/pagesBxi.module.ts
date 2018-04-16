import { ActivarAlertasIniComponent } from './activa-alertas/activar-alertas-ini/activar-alertas-ini.component';
import { ModalBxiErrorComponentComponent } from './modales/modal-bxi-error-component/modal-bxi-error-component.component';
import { SesionBxiService } from './sesion-bxi.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { PagoTarjetaCreditoComponent } from './pagos-tarjeta-credito/pago-tarjeta-credito/pago-tarjeta-credito.component';

// tslint:disable-next-line:max-line-length
import { PagoTarjetaCreditoVerifyComponent } from './pagos-tarjeta-credito/pago-tarjeta-credito-verify/pago-tarjeta-credito-verify.component';
import { MantenimientoDatosIniComponent } from './mantenimiento-datos-contacto/mantenimiento-datos-ini/mantenimiento-datos-ini.component';
import { MantenimientoDatosVerifyComponent } from './mantenimiento-datos-contacto/mantenimiento-datos-verify/mantenimiento-datos-verify.component';
import { ActivarAlertasVerifyComponent } from './activa-alertas/activar-alertas-verify/activar-alertas-verify.component';


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
        PagoTarjetaCreditoComponent,
        PagoTarjetaCreditoVerifyComponent,
        ModalBxiErrorComponentComponent,
        ActivarAlertasIniComponent,
        MantenimientoDatosIniComponent,
        MantenimientoDatosVerifyComponent,
        ActivarAlertasVerifyComponent,
        
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
        ReactiveFormsModule

        
    ],
    providers: [ SesionBxiService,  { provide: MAT_KEYBOARD_LAYOUTS, useValue: customLayouts}, CurrencyPipe],
})

export class PagesBxiModule {} 
