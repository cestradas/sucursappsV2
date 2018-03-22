import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-movimientosaldo',
  templateUrl: './movimientosaldo.component.html'
})
export class MovimientosaldoComponent implements OnInit {
DatosJSON: any;
ALIAS: any;
alias: any = '';
TamArray: any;
numPaginas: any;
tamPaginas: any = 8;
arrayNumPag:  Array<any> = [];
NumeroDatoInicial: any = 0;
NumeroDatoFinal: any = 8;
Comparador: any;
contador: any;
movimientos: any;
movimientosCue: any;
dia: any;
mes: any;
anio: any;
options = 0;
par = 0;
fechaCompleta: any;
constructor() {
  }

  ngOnInit() {
    this.consultaClabeSaldo ("1", "0100000034");
  }

calcularFecha() {
  const this_aux = this;
  this_aux.options = this_aux.options + 1 ;
  console.log(this_aux.options % 2 + "par o impar");
  this_aux.par = this_aux.options % 2;
  
  if (  this_aux.par === 0 ) {
    console.log("si");

    
    
  } else {
    this_aux.dia = new Date().getUTCDate();
    this_aux.mes = new Date().getUTCMonth() + 1;
    this_aux.anio = new Date().getFullYear();

   // this_aux.fechaCompleta = ;
    console.log("no");
    console.log(this_aux.dia + " Este es el dia " + this_aux.mes + " este es el mes" + this_aux.anio + "Este es el año");
  }

  console.log(this_aux.options);
  console.log(this_aux.par);
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

     

      const formParameters = {
        txtTipoMov : tipoMovimiento, 
        txtNumCuenta: numeroCuenta
      }; 

      console.log("si entre: ", tipoMovimiento, numeroCuenta);

      const resourceRequest = new WLResourceRequest(
        'adapters/AdapterBanorteSucursApps/resource/ConsultaClabesSaldos', WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        
        resourceRequest.sendFormParameters(formParameters).then(
          function(response) {
           console.log(response.responseText);
           this_aux.alias = response.responseJSON;
           console.log(this_aux.alias);
           console.log(this_aux.alias.DescripVariableUno);
            const detalleCuenta = response.responseJSON;
            if ( detalleCuenta.Id === '1') {

              const textTitular = detalleCuenta.SaldoDia;
              this_aux.ConsultaMovimientos("0100000034", "2018-02-01", "2018-02-28", "N", "N", "100");
            } else {
              console.log(detalleCuenta.MensajeAUsuario);
            }
          }, function(error) {
      });

       
    }

    
    ConsultaMovimientos(numeroCue, fDesde, fHasta, comi, pag, numreg) {
      const this_aux = this;
      console.log("si entre 2: ", numeroCue, fDesde, fHasta, comi, pag, numreg);
      const formParameters = {
        cuenta: numeroCue,
        fechaDesde: fDesde,
        fechaHasta: fHasta,
        Comision: comi,
        Pagina: pag,
        numeroRegistros: numreg
      }; 
      const resourceRequest = new WLResourceRequest(
        'adapters/AdapterBanorteSucursApps/resource/ConsultaMovimientos', WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        
        resourceRequest.sendFormParameters(formParameters).then(
          function(response) {
           // console.log(response.responseText);
           this_aux.movimientos = response.responseJSON;
           console.log(this_aux.movimientos);
             this_aux.movimientosCue = this_aux.movimientos.movimientos;
             this_aux.TamArray = this_aux.movimientosCue.length;
             this_aux.numPaginas = this_aux.TamArray / this_aux.tamPaginas;
        let i = 0;
      for (i; i < this_aux.numPaginas; i ++) {
        this_aux.arrayNumPag.push(i);
      }
           console.log(this_aux.movimientos.movimientos[0]);
           console.log(this_aux.movimientosCue[0].DescripVariableUno);
            const detalleCuenta = response.responseJSON;
            if ( detalleCuenta.Id === '1') {

              const textTitular = detalleCuenta;
            } else {
              console.log(detalleCuenta.MensajeAUsuario);
            }
          }, function(error) {
      });

    }  
}
