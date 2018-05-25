import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class SesionTDDService {

  datosBreadCroms: DatosBreadCroms = {
    nombreUsuarioTDD: '',
    sicUsuarioTDD: '',
    EmailCliente: '',
    CelCliente: '',
    numeroCliente: ''
  };

  constructor(@Inject(DOCUMENT) private _document) {}

}

interface DatosBreadCroms {

  nombreUsuarioTDD: string;
  sicUsuarioTDD: string;
  EmailCliente: string;
  CelCliente: string;
  numeroCliente: string;

}
