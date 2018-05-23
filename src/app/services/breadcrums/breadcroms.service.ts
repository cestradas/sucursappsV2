import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class SesionTDDService {

  datosBreadCroms: DatosBreadCroms = {
    nombreUsuarioTDD: '',
    EmailCliente: '',
    CelCliente: ''
  };

  constructor(@Inject(DOCUMENT) private _document) {}

}

interface DatosBreadCroms {

  nombreUsuarioTDD: string;
  EmailCliente: string;
  CelCliente: string;

}
