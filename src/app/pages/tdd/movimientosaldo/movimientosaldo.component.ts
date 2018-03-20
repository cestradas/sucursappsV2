import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-movimientosaldo',
  templateUrl: './movimientosaldo.component.html'
})
export class MovimientosaldoComponent implements OnInit {
DatosJSON: any;
ALIAS: any;
alias: any;
TamArray: any;
numPaginas: any;
tamPaginas: any = 8;
arrayNumPag:  Array<any> = [];
NumeroDatoInicial: any = 0;
NumeroDatoFinal: any = 8;
Comparador: any;
contador: any;
constructor() {


  }

  ngOnInit() {
     this.movimientos();
    this.consultaClabeSaldo ("1", "0100000034");
  }


movimientos() {
  // tslint:disable-next-line:max-line-length
  const Infocuentas = '{"Id":"1","ArrayCuentas":[{"Alias":"Suma N\u00f3mina","IdCuenta":92425410,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425411,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425412,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"},{"Alias":"Suma N\u00f3mina","IdCuenta":92425467,"NoCuenta":"0101361424"}],"MensajeAUsuario":"SUCCESS"}';
  this.DatosJSON = JSON.parse(Infocuentas);
  this.ALIAS = this.DatosJSON.ArrayCuentas;
  this.TamArray = this.ALIAS.length;
  this.numPaginas = this.TamArray / this.tamPaginas;
  let i = 0;
  for (i; i < this.numPaginas; i ++) {
    this.arrayNumPag.push(i);
  }


}

Cambiarpagina(NumeroPag) {
  this.NumeroDatoFinal = (NumeroPag.textContent ) * this.tamPaginas ;
  this.NumeroDatoInicial = this.NumeroDatoFinal - this.tamPaginas;
}

    PreviousPag (NumPrev) {
      if (NumPrev <= this.tamPaginas) {
        this.NumeroDatoInicial = 0;
        this.NumeroDatoFinal = this.tamPaginas;
      } else {
        this.NumeroDatoFinal = NumPrev - this.tamPaginas;
        this.NumeroDatoInicial = this.NumeroDatoFinal - this.tamPaginas;
      }
    }

    NextPag (NumNext) {

      if (NumNext >= this.TamArray ) {
        this.NumeroDatoFinal = this.TamArray;
        for ( let i = 0; i < this.numPaginas; i++) {
          this.contador = i;
        }
        this.NumeroDatoInicial = (this.contador) * this.tamPaginas;
      } else {
        this.NumeroDatoFinal = NumNext + this.tamPaginas;
        this.NumeroDatoInicial = this.NumeroDatoFinal - this.tamPaginas;
      }
    }


    
    consultaClabeSaldo(tipoMovimiento, numeroCuenta) {
      const this_aux = this;
      console.log("si entre: ", tipoMovimiento, numeroCuenta);
      const formParameters = {
        txtTipoMov : tipoMovimiento, 
        txtNumCuenta: numeroCuenta
      }; 
      const resourceRequest = new WLResourceRequest(
        'adapters/AdapterBanorteSucursApps/resource/ConsultaClabesSaldos', WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        
        resourceRequest.sendFormParameters(formParameters).then(
          function(response) {
           console.log(response.responseText);
           this_aux.alias = response.responseJSON;
           console.log(this_aux.alias);
           console.log(this_aux.alias.SaldoDisponible);
            const detalleCuenta = response.responseJSON;
            if ( detalleCuenta.Id === '1') {

              const textTitular = detalleCuenta.SaldoDia;
            } else {
              console.log(detalleCuenta.MensajeAUsuario);
            }
          }, function(error) {
      });

    }
}
