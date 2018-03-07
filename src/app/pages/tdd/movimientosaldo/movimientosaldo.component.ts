import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-movimientosaldo',
  templateUrl: './movimientosaldo.component.html'
})
export class MovimientosaldoComponent implements OnInit {
DatosJSON: any;
ALIAS: any;
TamArray: any;
numPaginas: any;
arrayNumPag:  Array<any> = [];
NumeroDatoInicial: any = 0;
NumeroDatoFinal: any = 5;
Comparador: any;
constructor() {


  }

  ngOnInit() {
    this.movimientos();
  }
movimientos() {
  // tslint:disable-next-line:max-line-length
  const Infocuentas = '{"Id":"1","ArrayCuentas":[{"Alias":"Suma N\u00f3mina","IdCuenta":92425410,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425411,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425412,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"}],"MensajeAUsuario":"SUCCESS"}';
  this.DatosJSON = JSON.parse(Infocuentas);
  this.ALIAS = this.DatosJSON.ArrayCuentas;
  this.TamArray = this.ALIAS.length;
  this.numPaginas = this.TamArray / 5;
  let i = 0;
  for (i; i < this.numPaginas; i ++) {
    this.arrayNumPag.push(i);
  }


}

Cambiarpagina(NumeroPag) {
  this.NumeroDatoFinal = (NumeroPag.textContent ) * 5 ;
  this.NumeroDatoInicial = this.NumeroDatoFinal - 5;
}

    PreviousPag (NumPrev) {
      if (NumPrev <= 5) {
        this.NumeroDatoInicial = 0;
        this.NumeroDatoFinal = 5;
      } else {
        this.NumeroDatoFinal = NumPrev - 5;
        this.NumeroDatoInicial = this.NumeroDatoFinal - 5;
      }
    }

    NextPag (NumNext) {
      if (NumNext >= this.TamArray ) {
        this.NumeroDatoFinal = this.TamArray;
        this.NumeroDatoInicial = this.NumeroDatoFinal - 5;
      } else {
        this.NumeroDatoFinal = NumNext + 5;
        this.NumeroDatoInicial = this.NumeroDatoFinal - 5;
      }
    }
}
