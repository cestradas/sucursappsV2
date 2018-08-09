import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import $ from 'jquery';
import { SesionTDDService } from '../../../services/breadcrums/breadcroms.service';

declare var $: any;
@Component({
  selector: 'app-movimientosaldo',
  templateUrl: './movimientosaldotdc.component.html',
  
})
export class MovimientosaldotdcComponent implements OnInit {
   nombreUsuarioTdc: string;
   cuentaClienteTdc: string;
   PagoMinimo: string;
   NumeroTarjeta: string;
   numCuenta_show: string;
  saldoDispoinible: string;
  SaldoActual: string;
 
  
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

  opcionSeleccionado: String = "0";
  
  moviMesActual: Array<any> = [] ;
  moviMesAnterior: Array<any> = [] ;
 
  constructor(private serviceSesion : SesionTDDService) {
    // this.service.cargarSaldosTDD();
    // this.service.validarDatosSaldoTdd().then(
      // mensaje => {

        // console.log('Saldos cargados correctamente TDC');
        // his.cuentaClienteTdc = mensaje.NumeroCuenta;
        
      // }
    // ); 
    
  }

  ngOnInit() {
     // ESTILOS Preferente
     let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
     let btnContinuar = document.getElementById("salir");
     let btnContinuar2 = document.getElementById("salir2");
     let btnContinuar3 = document.getElementById("salir3");
 
     if (storageTipoClienteTar === "true") {
 
       btnContinuar.classList.remove("color-botones");
       btnContinuar.classList.add("color-botones_Preferente");
       btnContinuar2.classList.remove("color-botones");
       btnContinuar2.classList.add("color-botones_Preferente");
       btnContinuar3.classList.remove("color-botones");
       btnContinuar3.classList.add("color-botones_Preferente");
     }
     
    this.consultaMovimientosCreditom();
    this.consultaSaldosTarjetasm();
    this.llamarMovimientosTDC();
    $('#_modal_please_wait').modal('show');
  
  }
 

  cambiarPagina(numeroPag) {
    this.numeroDatoFinal = (numeroPag ) * this.tamPaginas ;
    this.numeroDatoInicial = this.numeroDatoFinal - this.tamPaginas;
  }

  paginador2() {
  
    const this_aux = this;
    let paginasVisibles = 8 ;
    if (this_aux.numPaginas < paginasVisibles) {
        paginasVisibles = this_aux.numPaginas ;
    }
    $('#paginador').twbsPagination('destroy');
    $('#paginador').twbsPagination({
      startpages: 1,
      totalPages: this_aux.numPaginas,
      visiblePages: paginasVisibles,
      first: '',
      last: '',
      prev: 'Anterior',
      next: 'Siguiente',
      onPageClick: function (event, page) {
        console.log(page);
        this_aux.cambiarPagina(page);
      
      }
  });
  }
  
  
 
  
  quitartabla() {
    const div = document.getElementById('tblDatos');
    div.style.display = "none";
    const div2 = document.getElementById('Navegador');
    div2.style.display = "none";
    div2.style.alignContent = "center";
  
    
  }

  consultaMovimientosTDC(tipoconsulta) {
  
  
    const this_aux = this;
    console.log(this_aux.opcionSeleccionado);
    this_aux.mostrarSaldoCredito();
    const formParameters = {
      tipoConsulta: tipoconsulta
    }; 
    
    console.log(formParameters);
      
    const resourceRequest = new WLResourceRequest(
        'adapters/AdapterBanorteSucursAppsTdc/resource/consultaMovimientosTarjetas', WLResourceRequest.POST);
                  
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
              
             if (  this_aux.movimientosCue === null || this_aux.movimientosCue === undefined) {
              console.log(detalleCuenta.MensajeAUsuario);
              this_aux.sinMovimientos(this_aux.par);
             } else {
               
              this_aux.TamArray = this_aux.movimientosCue.length;
              this_aux.numPaginas = this_aux.TamArray / this_aux.tamPaginas;             
    
                  const textTitular = detalleCuenta;
                  console.log(detalleCuenta.MensajeAUsuario);
                  this_aux.mostrarTabla();
                  if (this_aux.numPaginas <= 1 ) { 
                    const div2 = document.getElementById('Navegador');
                    div2.style.display = "none";
                   }
                   
             }
             if (this_aux.options === 0) {
                $("#selecttdc").val('0');
             }
             
        
            }
            else{
              console.log("id"+detalleCuenta.Id);
              this_aux.showErrorSucces(detalleCuenta);
              
            } 
          }, function(error) {
            
            
      });
      console.log("Movimientos cargados correctamente tarjetas");
      setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
    }
    
   
    
    mostrarSaldoDebito() {
    
      const cuentaCredito = document.getElementById('cuentaCredito');
      cuentaCredito.setAttribute('style', 'display: none');
      
    }
    
    mostrarSaldoCredito() {
      this.mostrarSaldoDebito();
      const cuentaCredito = document.getElementById('cuentaCredito');
      cuentaCredito.setAttribute('style', 'display: block');
      
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
    llamarMovimientosTDC () {
      const this_aux = this;
      this_aux.options = this_aux.options + 1 ;
      this_aux.par = this_aux.options % 2;
      this_aux.arrayNumPag = [];
      this_aux.numeroDatoInicial = 0;
      this_aux.numeroDatoFinal = this_aux.tamPaginas;
      if (  this_aux.par === 0 ) {
        this.consultaMovimientosTDC("00"); // va un parametro 01 00
      } else {
        this.consultaMovimientosTDC("01"); 
      }
      this.quitartabla();
      $('#_modal_please_wait').modal('show');
      
    }
  
    noMovMesAct () {
      const div = document.getElementById('noMovimientosMesAnterior');
      $('#noMovimientosMesAnterior').modal('show');
    }
    noMovMesAnt () {
      const div = document.getElementById('noMovimientosMesActual');
      $('#noMovimientosMesActual').modal('show');
    }
    timeOut () {
      const div = document.getElementById('timeOut');
      $('#timeOut').modal('show');
    
    }
    consultaMovimientosCreditom() {
    const this_aux = this;
    const formParameters = {
     
    };

      const resourceRequest = new WLResourceRequest(
        'adapters/AdapterBanorteSucursAppsTdc/resource/consultaMovimientosTarjetas', WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        
        resourceRequest.sendFormParameters(formParameters).then(
          function(response) {
            console.log(response.responseText);
            this_aux.movimientos = response.responseJSON;
            if (this_aux.movimientos === null) { 
              this_aux.timeOut();
            }
            
            const detalleCuenta = response.responseJSON;
            if ( detalleCuenta.Id === '1') {// uno servicio es que tiene datos y si es 0 es un error
              this_aux.movimientosCue = this_aux.movimientos.movimientos;

              console.log(this_aux.movimientosCue);
              
             if (  this_aux.movimientosCue === null || this_aux.movimientosCue === undefined) {
              console.log(detalleCuenta.MensajeAUsuario);
              this_aux.sinMovimientos(this_aux.par);
             } else {
               
              this_aux.TamArray = this_aux.movimientosCue.length;
              this_aux.numPaginas = this_aux.TamArray / this_aux.tamPaginas;             
    
                  const textTitular = detalleCuenta;
                  console.log(detalleCuenta.MensajeAUsuario);
                  this_aux.mostrarTabla();
                  if (this_aux.numPaginas <= 1 ) { 
                    const div2 = document.getElementById('Navegador');
                    div2.style.display = "none";
                   }
                   
             }
             if (this_aux.options === 0) {
                $("#selecttdc").val('0');
             }
             
            }
            console.log("Consulta Saldos");
            this_aux.consultaSaldosTarjetasm();
          }, function(error) {
            
            
      });
      console.log("Movimientos cargados correctamente");
      setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
    }
    consultaSaldosTarjetasm() {
      const this_aux = this;
      const formParameters = { 
      }; 
      
      console.log(formParameters);
             
      const resourceRequest = new WLResourceRequest(
        
        'adapters/AdapterBanorteSucursAppsTdc/resource/consultaSaldosTarjetas', WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        
        resourceRequest.sendFormParameters(formParameters).then(
          function(response1) {
            console.log(response1.responseText);

            const detalleSaldos = response1.responseJSON;
            $('#_modal_please_wait').modal('hide');
            if ( detalleSaldos.Id === '1') {
              this_aux.saldoDispoinible = detalleSaldos.SaldoDisponible;
              this_aux.saldoDispoinible = this_aux.saldoDispoinible;
              this_aux.SaldoActual = detalleSaldos.SaldoActual;
              this_aux.NumeroTarjeta = detalleSaldos.NumeroTarjeta;
              this_aux.PagoMinimo = detalleSaldos.PagoMinimo;
              this_aux.mascaraNumeroCuenta(this_aux.NumeroTarjeta);
              this_aux.nombreUsuarioTdc = this_aux.serviceSesion.datosBreadCroms.nombreUsuarioTDD;
              $('#_modal_please_wait').modal('hide');
    
            } else {
               this_aux.showErrorSucces(detalleSaldos);
            }
          }, function(error) {
            this_aux.showErrorPromise(error);
      });
    }
    showErrorSucces(json) {
      console.log(json.Id + json.MensajeAUsuario);
      if (json.Id === '2') {
        document.getElementById('mnsError').innerHTML =   'El servicio no esta disponible, favor de intentar mas tarde';
      } else {
        document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
      }
      $('#errorModal').modal('show');
      }
      
      showErrorPromise(error) {
      console.log(error);
      // tslint:disable-next-line:max-line-length
      document.getElementById('mnsError').innerHTML = "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde."; 
      setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
      $('#errorModal').modal('show');
      }  

      mascaraNumeroCuenta(numCtaSel) {
        const tamNumCta = numCtaSel.length;
        const numCta_aux = numCtaSel.substring(tamNumCta - 4, tamNumCta);
        this.numCuenta_show = '******' + numCta_aux;
        return this.numCuenta_show;
      }
    
}
