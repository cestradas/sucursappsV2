import { Component, OnInit } from '@angular/core';
import { ConsultaSaldosTddService } from '../../../services/saldosTDD/consultaSaldos.service';
import { SesionBxiService } from '../../bxi/sesion-bxi.service';
import { Subscription } from 'rxjs/Subscription';
import $ from 'jquery';
import { SesionTDDService } from '../../../services/breadcrums/breadcroms.service';
declare var $: any;
@Component ({
  selector: 'app-movimientosaldo',
  templateUrl: './movimientosaldo.component.html'
})
export class MovimientosaldoComponent implements OnInit {
 
  subscription: Subscription;

  cuentaClienteTdd: string;
  clabeClienteTdd: string;
  saldoDiaClienteTdd: string;
  saldoDisponibleClienteTdd: string;
  saldoRetenidoClienteTdd: string;
  saldoMesAnteriorClienteTdd: string;
  nombreUsuarioTdd: string;
  
  
  
  alias: any = '';
  TamArray: any;
  numPaginas: any;
  tamPaginas: any = 8;
  arrayNumPag:  Array<any> = [];
  numeroDatoInicial: any = 0;
  numeroDatoFinal: any = this.tamPaginas;
  movimientos: any;
  movimientosCue: any;
  dia: any;
  mes: any;
  anio: any;
  options = 0;
  par = 0;
  fechaMesActualFin: String;
  fechaMesActualIni: String;
  diaMesAnterior: any;

constructor( private _service: ConsultaSaldosTddService, 
             private _serviceSesion: SesionTDDService) {
              
              
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

    
    this._service.validarDatosSaldoTdd().then(
      mensaje => {

        console.log('Saldos cargados correctamente TDD');
        this.cuentaClienteTdd = mensaje.NumeroCuenta;
        this.clabeClienteTdd = mensaje.ClabeCuenta;
        this.saldoDiaClienteTdd = mensaje.SaldoDia;
        this.saldoDisponibleClienteTdd = mensaje.SaldoDisponible;
        this.saldoRetenidoClienteTdd = mensaje.SaldoRetenido;
        this.saldoMesAnteriorClienteTdd = mensaje.SaldoMesAnterior;
        this.nombreUsuarioTdd = this._serviceSesion.datosBreadCroms.nombreUsuarioTDD;
        this_aux.llamarMovimientos ( this.cuentaClienteTdd );

      }
    );

  }

  ngOnInit() {
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
      this_aux.llamarMovimientos (this.cuentaClienteTdd);
    
    } else {
      if ( (this_aux.mes - 1) < 10) {
        this_aux.fechaMesActualFin = (this_aux.anio + "-" + "0" + (this_aux.mes - 1) + "-" + this_aux.diaMesAnterior).toString();
        this_aux.fechaMesActualIni = (this_aux.anio + "-" + "0" + (this_aux.mes - 1) + "-01").toString();
        this_aux.llamarMovimientos (this.cuentaClienteTdd);
      } else {
        this_aux.fechaMesActualFin = (this_aux.anio + "-" + (this_aux.mes - 1) + "-" + this_aux.diaMesAnterior).toString();
        this_aux.fechaMesActualIni = (this_aux.anio + "-" + (this_aux.mes - 1) + "-01").toString();
        this_aux.llamarMovimientos (this.cuentaClienteTdd);
      }
    }
  }

cambiarPagina(numeroPag) {
  this.numeroDatoFinal = (numeroPag.textContent ) * this.tamPaginas ;
  this.numeroDatoInicial = this.numeroDatoFinal - this.tamPaginas;
}

previousPag (numPrev) {
  if ((this.numeroDatoFinal - 1) >= this.tamPaginas ) {
    let numeroPagActual = (numPrev / this.tamPaginas) - 1;
    this.numeroDatoFinal = (numeroPagActual) * this.tamPaginas ;
    this.numeroDatoInicial = this.numeroDatoFinal - this.tamPaginas;
  }
  
}

nextPag (numeroNex) {
  if ((this.numeroDatoFinal + 1) <= this.TamArray) {
    let numeroPagActual = (numeroNex / this.tamPaginas) + 1;
    this.numeroDatoFinal = (numeroPagActual) * this.tamPaginas ;
    this.numeroDatoInicial = this.numeroDatoFinal - this.tamPaginas;
  }
}

// tslint:disable-next-line:one-line
llamarMovimientos (numCuenta) {
  this.quitartabla();
  $('#_modal_please_wait').modal('show');
  this.ConsultaMovimientos(numCuenta, this.fechaMesActualIni  , this.fechaMesActualFin, "N", "N", "100");
  
}
    
    ConsultaMovimientos(numeroCue, fDesde, fHasta, comi, pag, numreg) {
      const this_aux = this;
      const formParameters = {
        cuenta: numeroCue,
        fechaDesde: fDesde,
        fechaHasta: fHasta,
        Comision: comi,
        Pagina: pag,
        numeroRegistros: numreg
      }; 
      
             
      const resourceRequest = new WLResourceRequest(
        
        'adapters/AdapterBanorteSucursApps/resource/consultaMovimientos', WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        
        resourceRequest.sendFormParameters(formParameters).then(
          function(response) {
           // console.log(response.responseText);
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
              if (this_aux.numPaginas < 1 ) { 
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
    quitartabla() {
      const div = document.getElementById('tblDatos');
      div.style.display = "none";
      const div2 = document.getElementById('Navegador');
      div2.style.display = "none";
      div2.style.alignContent = "center";
    
      
    }
    mostrarTabla () {
      const div = document.getElementById('tblDatos');
      div.style.display = "block";

      const div2 = document.getElementById('Navegador');
      div2.style.display = "block";
    }
}

