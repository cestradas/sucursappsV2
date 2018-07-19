import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { SesionBxiService } from '../../sesion-bxi.service';
import { OperacionesBXI } from '../../operacionesBXI';
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
  SaldoActual: string;
  
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
  opcionSeleccionado: String = "0" ;
  
  moviMesActual: Array<any> = [] ;
  moviMesAnterior: Array<any> = [] ;
  constructor(private service: SesionBxiService) {

  }

  ngOnInit() {
   
    

    
    this.tipoCuenta = this.service.aliasCuentaSeleccionada;
    this.divisa = this.service.divisa;

    this.saldoDispoinible = this.service.saldoSeleccionado;
    this.SaldoActual = this.service.SaldoActual;

    console.log(this.service.saldoSeleccionado);

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
     
    console.log("valor inicial tipo cuenta" + this.service.tipoCuenta);
    if (this.service.tipoCuenta === "1") {
      const div2 = document.getElementById('selectTDD');
      div2.style.display = "block";
      $("#selecttdd").val('0');

     } else {
      const div2 = document.getElementById('selectTDC');
      div2.style.display = "block";
      $("#selecttdc").val('0');
     }
     // ESTILOS Preferente
    let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    

    if (storageTipoClienteBEL === "true") {

     }
     

     this.seleccionarTipoCuenta();
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
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    if ( tipCuenta === "1" ) {
      console.log("Cuenta TDD");

      this.cuentaClienteBXI = operacionesbxi.mascaraNumeroCuenta(this.service.numCuentaSeleccionado);
      this.noTarjeta = operacionesbxi.mascaraNumeroTarjeta(this.service.numCuentaSeleccionado);
      this.llamarMovimientosTDD (this.service.numCuentaSeleccionado);

    } else {
      this.cuentaClienteBXI = operacionesbxi.mascaraNumeroTarjeta(this.service.numCuentaSeleccionado);
      this.noTarjeta = operacionesbxi.mascaraNumeroTarjeta(this.service.numCuentaSeleccionado);
      this.llamarMovimientosTDC (this.service.numCuentaSeleccionado);
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
    const div = document.getElementById('tblDatosTDD');
    div.style.display = "none";

    const div2 = document.getElementById('Navegador');
    div2.style.display = "none";
    div2.style.alignContent = "center";

    const div3 = document.getElementById('tblDatosTDC');
    div3.style.display = "none";
  
  }

consultaMovimientosTDC(numeroCue) {

  
  const this_aux = this;
  console.log(this_aux.opcionSeleccionado);
  this_aux.mostrarSaldoCredito();
  const formParameters = {
    cuenta: numeroCue,
    tipoConsulta: this_aux.opcionSeleccionado
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
          
         if ( this_aux.movimientosCue === undefined ) {
          console.log(detalleCuenta.MensajeAUsuario);
          this_aux.sinMovimientosTDC(this_aux.par);
         } else {
          this_aux.TamArray = this_aux.movimientosCue.length;
          this_aux.numPaginas = this_aux.TamArray / this_aux.tamPaginas;         
              const textTitular = detalleCuenta;
              console.log(detalleCuenta.MensajeAUsuario);
              if (this_aux.numPaginas > 1) {
                if (this_aux.numPaginas % 1 !==  0) {
                  this_aux.numPaginas = Math.trunc(this_aux.numPaginas) + 1;
                } 
                this_aux.paginador2();
              }
              this_aux.mostrarTablaTDC();
              if (this_aux.numPaginas <= 1 ) { 
                const div2 = document.getElementById('Navegador');
                div2.style.display = "none";
               }
               
         }
         if (this_aux.options === 0) {
            $("#selecttdc").val('0');
         }
         
          
        } else {
          this_aux.showErrorSucces(detalleCuenta);

        }
        setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
        console.log("Movimientos cargados correctamente");
      }, function(error) {
        this_aux.showErrorPromise(error);
        setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
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
  $('#errorModal').modal('show');
  if (error.errorCode === 'API_INVOCATION_FAILURE') {
      document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
  } else {
    document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
  }
}



mostrarSaldoDebito() {

  const cuentaDebito = document.getElementById('cuentaDebito');
  cuentaDebito.setAttribute('style', 'display: block');

  const cuentaCredito = document.getElementById('cuentaCredito');
  cuentaCredito.setAttribute('style', 'display: none');
  
}

mostrarSaldoCredito() {
  this.mostrarSaldoDebito();
  const cuentaCredito = document.getElementById('cuentaCredito');
  cuentaCredito.setAttribute('style', 'display: block');
  const cuentaDebito = document.getElementById('cuentaDebito');
  cuentaDebito.setAttribute('style', 'display: none');
  
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
            if (this_aux.numPaginas > 1) {
              if (this_aux.numPaginas % 1 !==  0) {
                this_aux.numPaginas = Math.trunc(this_aux.numPaginas) + 1;
              } 
              this_aux.paginador2();
            }
            const textTitular = detalleCuenta;
            console.log(detalleCuenta.MensajeAUsuario);
            
            this_aux.mostrarTablaTDD();
            if (this_aux.numPaginas <= 1 ) { 
              const div2 = document.getElementById('Navegador');
              div2.style.display = "none";
             }
          } else {
            console.log(detalleCuenta.MensajeAUsuario);
            if (detalleCuenta.Id === '2') {
              this_aux.showErrorSucces(detalleCuenta);
            } else {
              this_aux.sinMovimientos(this_aux.par);
            }
            
            
          }
          if (this_aux.options === 0) {
            $("#selecttdd").val('0');
            
         }
         setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
        }, function(error) {

          setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
          this_aux.showErrorPromise(error);
    });

    this_aux.mostrarSaldoDebito();
    console.log("Movimientos cargados correctamente");
    
  }

  mostrarTablaTDD () {
    const div = document.getElementById('tblDatosTDD');
    div.style.display = "block";

    const div2 = document.getElementById('Navegador');
    div2.style.display = "block";
  }

  mostrarTablaTDC () {
    const div = document.getElementById('tblDatosTDC');
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

  sinMovimientosTDC(num) {
    if (num === 0 ) {
      console.log("no hay movimientos despues del corte");
      this.quitartabla ();
      this.noMovDesCort ();
      
    } else {
      console.log("no hay movimientos en el corte anterior");
      this.quitartabla ();
      this.noMovUltCort();
      
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

  noMovDesCort () {
    const div = document.getElementById('noMovimientosDespuesCorte');
    $('#noMovimientosDespuesCorte').modal('show');
  
  }
  noMovUltCort () {
    const div = document.getElementById('noMovimientosUltimoCorte');
    $('#noMovimientosUltimoCorte').modal('show');
  
  }


  timeOut() {
    const div = document.getElementById('timeOut');
    $('#timeOut').modal('show');
  
  }


}
