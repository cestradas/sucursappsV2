import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { SesionBxiService } from '../../sesion-bxi.service';
declare var $: any;




@Component({
  selector: 'app-consulta-movimientos-detail',
  templateUrl: './consulta-movimientos-detail.component.html',
})

export class ConsultaMovimientosDetailComponent implements OnInit {
  
  cuentaClienteBXI: String;
  tipoCuenta: String;
  noTarjeta: String;
  divisa: String;


  saldoDispoinible: String;
  
  alias: any = '';
  TamArray: any;
  numPaginas: any;
  tamPaginas: any = 8;
  arrayNumPag:  Array<any> = [];
  numeroDatoInicial: any = 0;
  numeroDatoFinal: any = this.tamPaginas;
  movimientos: any ;
  movimientosCue: any ;
  dia: any;
  mes: any;
  anio: any;
  options = 0;
  par = 0;
  fechaMesActualFin: String;
  fechaMesActualIni: String;
  diaMesAnterior: any;
  
  moviMesActual: Array<any> = [] ;
  moviMesAnterior: Array<any> = [] ;
  constructor(private service: SesionBxiService) { 

    

  }

  ngOnInit() {
   

    this.cuentaClienteBXI = this.service.numCuentaSeleccionado;
    this.tipoCuenta = this.service.aliasCuentaSeleccionada;
    this.noTarjeta = this.service.noTarjetaSeleccionada;
    this.divisa = this.service.divisa;
    this.saldoDispoinible = this.service.saldoSeleccionado;

    console.log(this.cuentaClienteBXI);
    const this_aux = this;
    this_aux.dia = new Date().getUTCDate();
    this_aux.mes = (new Date().getUTCMonth() + 1);
    this_aux.anio = new Date().getFullYear();
    let date = new Date();
    this_aux.diaMesAnterior = new Date(date.getFullYear(), (this_aux.mes - 1), 0).getUTCDate();

        if (this_aux.mes < 10) {
            this_aux.mes = "0" + this_aux.mes;
        }
        if (this_aux.dia < 10) {
           this_aux.dia = "0" + this_aux.dia;
        }
    this_aux.fechaMesActualFin = (this_aux.anio + "-" + this_aux.mes + "-" + this_aux.dia).toString();
    this_aux.fechaMesActualIni = (this_aux.anio + "-" + this_aux.mes + "-01").toString();
     this.seleccionarTipoCuenta();
  }


  previousPag (numPrev) {
    if ((this.numeroDatoFinal - 1) >= this.tamPaginas ) {
      let numeroPagActual = (numPrev / this.tamPaginas) - 1;
      this.numeroDatoFinal = (numeroPagActual) * this.tamPaginas ;
      this.numeroDatoInicial = this.numeroDatoFinal - this.tamPaginas;
    }
    
  }

  cambiarPagina(numeroPag) {
    this.numeroDatoFinal = (numeroPag.textContent ) * this.tamPaginas ;
    this.numeroDatoInicial = this.numeroDatoFinal - this.tamPaginas;
  }

  nextPag (numeroNex) {
    if ((this.numeroDatoFinal + 1) <= this.TamArray) {
      let numeroPagActual = (numeroNex / this.tamPaginas) + 1;
      this.numeroDatoFinal = (numeroPagActual) * this.tamPaginas ;
      this.numeroDatoInicial = this.numeroDatoFinal - this.tamPaginas;
    }
  }


  calcularFecha() {
    const this_aux = this;
    this_aux.options = this_aux.options + 1 ;
    this_aux.par = this_aux.options % 2;
    this_aux.arrayNumPag = [];
    this_aux.numeroDatoInicial = 0;
    this_aux.numeroDatoFinal = this_aux.tamPaginas;
    
    if (  this_aux.par === 0 ) {
      this_aux.fechaMesActualFin = (this_aux.anio + "-" + this_aux.mes + "-" + this_aux.dia).toString();
      this_aux.fechaMesActualIni = (this_aux.anio + "-" + this_aux.mes + "-01").toString();
      this.seleccionarTipoCuenta();
    
    } else {
      if ( (this_aux.mes - 1) < 10) {
        this_aux.fechaMesActualFin = (this_aux.anio + "-" + "0" + (this_aux.mes - 1) + "-" + this_aux.diaMesAnterior).toString();
        this_aux.fechaMesActualIni = (this_aux.anio + "-" + "0" + (this_aux.mes - 1) + "-01").toString();
        this.seleccionarTipoCuenta();
      } else {
        this_aux.fechaMesActualFin = (this_aux.anio + "-" + (this_aux.mes - 1) + "-" + this_aux.diaMesAnterior).toString();
        this_aux.fechaMesActualIni = (this_aux.anio + "-" + (this_aux.mes - 1) + "-01").toString();
        this.seleccionarTipoCuenta();
      }
    }
  }

  seleccionarTipoCuenta() {
    let tipCuenta = this.service.tipoCuenta;
    if ( tipCuenta === "1" ) {
      console.log("Cuenta TDD");
      this.llamarMovimientosTDD (this.cuentaClienteBXI);

    } else {
      this.llamarMovimientosTDC (this.cuentaClienteBXI);
      console.log("Cuenta TDC");
    }
  }


  llamarMovimientosTDD (numCuenta) {
    this.quitartabla();
    $('#_modal_please_wait').modal('show');
    this.ConsultaMovimientosTDD(numCuenta, this.fechaMesActualIni  , this.fechaMesActualFin, "N", "N", "100");
    
  }

  llamarMovimientosTDC (numCuenta) {
    this.quitartabla();
    $('#_modal_please_wait').modal('show');
    this.consultaMovimientosTDC(numCuenta);
  }

  quitartabla() {
    const div = document.getElementById('tblDatos');
    div.style.display = "none";
    const div2 = document.getElementById('Navegador');
    div2.style.display = "none";
    div2.style.alignContent = "center";
  
    
  }

consultaMovimientosTDC(numeroCue) {
  const this_aux = this;
  const formParameters = {
    cuenta: numeroCue
  }; 
  
  console.log(formParameters);
         
  const resourceRequest = new WLResourceRequest(
    
    'adapters/AdapterBanorteSucursAppsBEL/resource/consultaMovimientosTarjetas', WLResourceRequest.POST);
    resourceRequest.setTimeout(30000);
    
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        console.log(response.responseText);
       this_aux.movimientos = response.responseJSON;
       if (this_aux.movimientos === null) { 
         this_aux.timeOut();
       }
        
        const detalleCuenta = response.responseJSON;
        if ( detalleCuenta.Id === '1') {

          this_aux.movimientosCue = this_aux.movimientos.movimientos;

          console.log(this_aux.movimientosCue);
          this_aux.movimentosMesActual(this_aux.movimientosCue);


          this_aux.TamArray = this_aux.movimientosCue.length;
          this_aux.numPaginas = this_aux.TamArray / this_aux.tamPaginas;
        
          

     let i = 0;
    
   for (i; i < this_aux.numPaginas; i ++) {
     this_aux.arrayNumPag.push(i);
   }

          const textTitular = detalleCuenta;
          console.log(detalleCuenta.MensajeAUsuario);
          this_aux.mostrarTabla();
          if (this_aux.numPaginas <= 1 ) { 
            const div2 = document.getElementById('Navegador');
            div2.style.display = "none";
           }
        } else {
          console.log(detalleCuenta.MensajeAUsuario);
          this_aux.sinMovimientos(this_aux.par);
          
        }
      }, function(error) {
  });
  console.log("Movimientos cargados correctamente");
  setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
}

movimentosMesActual (movimentos) {

  let mes = new Date().getUTCMonth() ;

  
  movimentos.forEach(movimiento => {
      console.log(movimiento);
      let algo = movimiento.FechaOperacion;
        console.log(algo);
         let mesMov = new Date(algo).getUTCMonth();
     console.log(mesMov);

    if (mes === mesMov ) {
     this.moviMesActual.push(movimiento);
    } 
    if ((mes - 1) === mesMov ) {
      this.moviMesAnterior.push(movimiento);
    }
  });

  console.log(this.moviMesActual);
  console.log(this.moviMesAnterior);
  if (  this.par === 0 ) {
    this.movimientosCue = this.moviMesActual;
  } else {
    this.movimientosCue = this.moviMesAnterior;
  }
  
console.log( this.movimientosCue);

}


  ConsultaMovimientosTDD(numeroCue, fDesde, fHasta, comi, pag, numreg) {
    const this_aux = this;
    const formParameters = {
      cuenta: numeroCue,
      fechaDesde: fDesde,
      fechaHasta: fHasta,
      Comision: comi,
      Pagina: pag,
      numeroRegistros: numreg
    }; 
    
    console.log(formParameters);
           
    const resourceRequest = new WLResourceRequest(
      
      'adapters/AdapterBanorteSucursAppsBEL/resource/consultaMovimientos', WLResourceRequest.POST);
      resourceRequest.setTimeout(30000);
      
      resourceRequest.sendFormParameters(formParameters).then(
        function(response) {
          console.log(response.responseText);
         this_aux.movimientos = response.responseJSON;
         if (this_aux.movimientos === null) { 
           this_aux.timeOut();
         }
          
          const detalleCuenta = response.responseJSON;
          if ( detalleCuenta.Id === '1') {

            this_aux.movimientosCue = this_aux.movimientos.movimientos;
            this_aux.TamArray = this_aux.movimientosCue.length;
            this_aux.numPaginas = this_aux.TamArray / this_aux.tamPaginas;
       let i = 0;
      
     for (i; i < this_aux.numPaginas; i ++) {
       this_aux.arrayNumPag.push(i);
     }

            const textTitular = detalleCuenta;
            console.log(detalleCuenta.MensajeAUsuario);
            this_aux.mostrarTabla();
            if (this_aux.numPaginas <= 1 ) { 
              const div2 = document.getElementById('Navegador');
              div2.style.display = "none";
             }
          } else {
            console.log(detalleCuenta.MensajeAUsuario);
            this_aux.sinMovimientos(this_aux.par);
            
          }
        }, function(error) {
    });
    console.log("Movimientos cargados correctamente");
    setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
  }

  mostrarTabla () {
    const div = document.getElementById('tblDatos');
    div.style.display = "block";

    const div2 = document.getElementById('Navegador');
    div2.style.display = "block";
  }


  sinMovimientos(num) {
    if (num === 0 ) {
      console.log("no hay movimientos en mes actual");
      this.quitartabla ();
      this.noMovMesAct ();
      
    } else {
      console.log("no hay movimientos en mes anterior");
      this.quitartabla ();
      this.noMovMesAnt();
      
    }
  }


  noMovMesAct () {
    const div = document.getElementById('noMovimientosMesActual');
    $('#noMovimientosMesActual').modal('show');
  
  }
  noMovMesAnt () {
    const div = document.getElementById('noMovimientosMesAnterior');
    $('#noMovimientosMesAnterior').modal('show');
  
  }
  timeOut () {
    const div = document.getElementById('timeOut');
    $('#timeOut').modal('show');
  
  }


}
