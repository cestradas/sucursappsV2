import {Component, OnInit, Renderer2, ViewChild, ElementRef } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
// import "../../rxjs/Rx";
import {Router, CanActivate, ActivatedRouteSnapshot,  RouterStateSnapshot, Routes } from "@angular/router";
import { CurrencyPipe } from "@angular/common";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { ConsultaSaldosTddService } from '../../../services/saldosTDD/consultaSaldos.service';
import { ResponseWS } from '../../../services/response/response.service';
import { consultaCatalogos } from '../../../services/consultaCatalogos/consultaCatalogos.service';
declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-impresion-edc-tdc',
  templateUrl: './impresion-edc-tdc.component.html',
  styleUrls: []
})
export class ImpresionEdcTdcComponent implements OnInit {
  @ViewChild("listaCuentas", { read: ElementRef })
  listaCuentas: ElementRef;
  @ViewChild("calendario", { read: ElementRef })
  calendario: ElementRef;
  // @ViewChild('calendario') d1: ElementRef;

  fechas = '{"fechas":[]}';
  obj: any;
  numeroCuentaTitular: string;
  saldoDisponibleClienteTdd: string;
  mostrarCuentaMascara: string;

  saldoDispoinible: string;
  SaldoActual: string;
  NumeroTarjeta: string;

  numCuenta_show: string;

  bandera0 = 1;
  bandera1 = 1;
  bandera2 = 1;
  bandera3 = 1;
  bandera4 = 1;
  bandera5 = 1;
  bandera6 = 1;
  bandera7 = 1;
  bandera8 = 1;
  bandera9 = 1;
  bandera10 = 1;
  bandera11 = 1;

  cal_Click_0 = 0;
  cal_Click_1 = 0;
  cal_Click_2 = 0;
  cal_Click_3 = 0;
  cal_Click_4 = 0;
  cal_Click_5 = 0;
  cal_Click_6 = 0;
  cal_Click_7 = 0;
  cal_Click_8 = 0;
  cal_Click_9 = 0;
  cal_Click_10 = 0;
  cal_Click_11 = 0;

  Valida_Seleccion_Calendario0 = 0;
  Valida_Seleccion_Calendario1 = 0;
  Valida_Seleccion_Calendario2 = 0;
  Valida_Seleccion_Calendario3 = 0;
  Valida_Seleccion_Calendario4 = 0;
  Valida_Seleccion_Calendario5 = 0;
  Valida_Seleccion_Calendario6 = 0;
  Valida_Seleccion_Calendario7 = 0;
  Valida_Seleccion_Calendario8 = 0;
  Valida_Seleccion_Calendario9 = 0;
  Valida_Seleccion_Calendario10 = 0;
  Valida_Seleccion_Calendario11 = 0;

  cuadroCalendario;

  palomita0;
  palomita1;
  palomita2;
  palomita3;
  palomita4;
  palomita5;
  palomita6;
  palomita7;
  palomita8;
  palomita9;
  palomita10;
  palomita11;

  doc_1 = "";
  nombreDocumento = "";
  numDocumento = "";
  fechaCorteDoc = "";
  bloquearBoton = '0';
  itemSeleccionado: any;
  cuentaOrigenModal = "";
  // constructor(private router: Router, private renderer: Renderer2, private _service: ConsultaSaldosTddService,
  constructor(private router: Router, private renderer: Renderer2, private serviceTdd: ResponseWS) {
    const this_aux = this;
   
      this.consultaSaldosTarjetas(); 
      
   
    
    
   //setTimeout(() => this_aux.consultaCancelacionEDCDomicilio('1'), 500);//2 es para tdc 1 tdd  consulta
   //setTimeout(() => this_aux.consultaCancelacionEDCDomicilio('2'), 500);
  }

  
  ngOnInit() {

    $('#_modal_please_wait').modal('show');
    // ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");

    let btnSalir = document.getElementById("salir");
    let btnCorreo = document.getElementById("correo");
    let btnImprimirDOC = document.getElementById("imprimirDOC");
    let btnCancelarEnvioDomicilio = document.getElementById("cancelarEnvioDomicilio");
    let btnContinuarImp = document.getElementById("continuarImp");
    let btnErrorImp = document.getElementById("errorImp");
    let btnImpOK = document.getElementById("impOK");

    if (storageTipoClienteTar === "true") {

      
      btnSalir.classList.remove("color-botones");
      btnSalir.classList.add("color-botones_Preferente");
      btnCorreo.classList.remove("color-botones");
      btnCorreo.classList.add("color-botones_Preferente");
      btnImprimirDOC.classList.remove("color-botones");
      btnImprimirDOC.classList.add("color-botones_Preferente");
      btnCancelarEnvioDomicilio.classList.remove("color-botones");
      btnCancelarEnvioDomicilio.classList.add("color-botones_Preferente");
      btnContinuarImp.classList.remove("color-botones");
      btnContinuarImp.classList.add("color-botones_Preferente");
      btnErrorImp.classList.remove("color-botones");
      btnErrorImp.classList.add("color-botones_Preferente");
      btnImpOK.classList.remove("color-botones");
      btnImpOK.classList.add("color-botones_Preferente");
    }

    // oculta flechas
    let flechaCalI = document.getElementById("flechasEDCI");
    flechaCalI.setAttribute('style', 'opacity: 0; margin-top: 278px;' );
    let flechaCalD = document.getElementById("flechasEDCD");
    flechaCalD.setAttribute('style', 'opacity: 0; margin-top: 278px;' );

  }

  mantenimientoEDC() {
    const this_aux = this;
   
    console.log("adentro de mantenimiento EDC");
    const formParameters = {
       ctaO: this_aux.NumeroTarjeta
      //ctaO: '0100000034'
    };

    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursAppsTdc/resource/mantenimientoEDC',
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
//          console.log(response.responseText);
          const detalleMant = response.responseJSON;
          if(detalleMant.Id==="1"){
            
            this_aux.obtenerListaDocs();
          }
          else{
            setTimeout(() => $('#_modal_please_wait').modal('hide'), 500);
             setTimeout(function(){
                     
                      this_aux.showErrorSucces(detalleMant);
              },500);
          }
        
         
      },
        function(error) {
          console.error("Error");
          setTimeout(() => $('#_modal_please_wait').modal('hide'), 500);
          this_aux.showErrorPromise(error);
        });
  }

  obtenerListaDocs() {
    const this_aux = this;
    
    console.log("adentro de obtener Lista Docs");
    const formParameters = {
      documeto: this_aux.NumeroTarjeta
    //   documeto: '201536140'
    };

    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursAppsTdc/resource/listaDocs',
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {

        // console.log(response.responseText);
        let res = response.responseJSON;
        if(res[0].Id==="1"){
          if(res[0].EstadoLista==="OK"){
            this_aux.consultaCancelacionEDCDomicilio('2');


            setTimeout(function() {

              // console.log(res);
              this_aux.obj = JSON.parse(this_aux.fechas);
    
              for (let i = 1 ; i < res.length; i++) {
    
    
                let temp = res[i].Fecha.split("-");
                // Asigna numero de documento y fecha para escribir e imprimir el documento
                let tempCtaDoc = res[i].Documento;
                let fechaDoc = res[i].FechaObtenerDoc;
                let fechaDocPDF = res[i].Fecha;
    
                for (let k = 0; k < temp.length; k++) {
    
                  if ( k === 0 || k === 1 || k === 2 ) {
    
                    let strA = temp[k];
    
                    let strM = temp[k + 1];
                    if ( strM === "01") {strM = "Enero"; }
                    if ( strM === "02") {strM = "Febrero"; }
                    if ( strM === "03") {strM = "Marzo"; }
                    if ( strM === "04") {strM = "Abril"; }
                    if ( strM === "05") {strM = "Mayo"; }
                    if ( strM === "06") {strM = "Junio"; }
                    if ( strM === "07") {strM = "Julio"; }
                    if ( strM === "08") {strM = "Agosto"; }
                    if ( strM === "09") {strM = "Septiembre"; }
                    if ( strM === "10") {strM = "Octubre"; }
                    if ( strM === "11") {strM = "Noviembre"; }
                    if ( strM === "12") {strM = "Diciembre"; }
    
                    let strD = temp[k + 2];
    
    
                    this_aux.obj['fechas'].push({
                      "Anio" : strA,
                      "Mes" : strM,
                      "Dia" : strD,
                      "Documento" :  tempCtaDoc,
                      "FechaDoc": fechaDoc,
                      "fechaDocPDF": fechaDocPDF
                    });
    
                    break;
                  }
    
    
                }
    
    
             }
             // remover todos hijos del contenedor de los calendarios antes de insertar
             $("#calendario").empty();
             $("#calendario2").empty();
    
    
             let cont = 0;
             let contFechas = this_aux.obj.fechas.length - 1;
             let creaElement = document.createElement('div');
             let objCalendario1 = document.getElementById('calendario');
             let objCalendario2 = document.getElementById('calendario2');

             if ( res.length <= 6 ) {
              $('#calendario2').remove();
            } else {
                 // mostrar flechas
                 let flechaCalI = document.getElementById("flechasEDCI");
                 flechaCalI.setAttribute('style', 'opacity: .5; margin-top: 278px;');
                 let flechaCalD = document.getElementById("flechasEDCD");
                 flechaCalD.setAttribute('style', 'opacity: .5; margin-top: 278px;');
            }
             // let domString = '<div class="container"><span class="intro">Hello</span> <span id="name"> World!</span></div>';
    
             // validar que existan **********
             //if (existe) {
             // let getItenCal = document.getElementById('Itemcalendario0');
             // objCalendario1.removeChild(getItenCal);
             //}
    
    
             for (let i = res.length; i>=1; i--) {
    
              // if ( (res.length <= 12) && (res.length >= 7)) {
    
                if ( cont <= 5) {
    
    
                  // $("#calendario").append(
                  //  this.calendario.nativeElement.insertAdjacentHTML(
                  //    this.renderer.invokeElementMethod(this.calendario.nativeElement.insertAdjacentHTML('beforeend',
                  // this.htmlToAdd =
                  // this.calendario.insert(
                    //inserta los datos del documento dentro del value para mandarlos al servicio
                    let domContent = '<div value ="'+this_aux.obj['fechas'][contFechas].Documento + '"' + 'id="'+'Itemcalendario' + cont + '"' + ' class="kiosk-cec-carousel-item estilo-item-calendar" style="opacity: .5;" >' +
                    '<div value ="'+this_aux.obj['fechas'][contFechas].FechaDoc + '"' + 'id="'+'ItemcalendarioDoc' + cont + '"' + ' class="row no-space">' +
                        '<div class="col-xs-6">' +
                            '<div class="bg-grey-600 white vertical-align height-200 fondo-calendar" >' +
                                '<div class="vertical-align-middle">' +
                                    '<span class="icon-calendar size-icon-calendar" align="center" >' + this_aux.obj['fechas'][contFechas].Dia + '</span>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="col-xs-6">' +
                            '<div class="height-200 item-red-middle">' +
                                '<span class="font-size-30 size-fecha-calendar" >' + this_aux.obj['fechas'][contFechas].Mes + ' ' + this_aux.obj['fechas'][contFechas].Anio + '</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
    
                '</div>' ;
    
                creaElement.innerHTML = domContent;
            //    objCalendario1.addEventListener("click", function(event) {
            //      console.log(event.target);
            //      console.log(this.id);
            //    });
                objCalendario1.appendChild(creaElement.firstChild);
               //  document.body.appendChild(creaElement.firstChild);
               // objTo.appendChild(this_aux.calendario.nativeElement);
    
                  contFechas --;

                  if (contFechas < 0) {
                    break;
                  }
              }
    
              cont ++;
    
              if (cont === 6) {
                break;
              }
             }
             // Validar seleecion de cada calendario (primer elemnto carousel)
             let elementoCal0 = document.getElementById('Itemcalendario0');
             let elementoCal1 = document.getElementById('Itemcalendario1');
             let elementoCal2 = document.getElementById('Itemcalendario2');
             let elementoCal3 = document.getElementById('Itemcalendario3');
             let elementoCal4 = document.getElementById('Itemcalendario4');
             let elementoCal5 = document.getElementById('Itemcalendario5');

            if (elementoCal0 != null) {
              elementoCal0.addEventListener("click", function(event) {
                console.log(this.id);
                if( ((this_aux.Valida_Seleccion_Calendario0 === 0) || (this_aux.Valida_Seleccion_Calendario0 === 1))
                    && (this_aux.Valida_Seleccion_Calendario1 === 0)
                    && (this_aux.Valida_Seleccion_Calendario2 === 0)
                    && (this_aux.Valida_Seleccion_Calendario3 === 0)
                    && (this_aux.Valida_Seleccion_Calendario4 === 0)
                    && (this_aux.Valida_Seleccion_Calendario5 === 0)
                    && (this_aux.Valida_Seleccion_Calendario6 === 0)
                    && (this_aux.Valida_Seleccion_Calendario7 === 0)
                    && (this_aux.Valida_Seleccion_Calendario8 === 0)
                    && (this_aux.Valida_Seleccion_Calendario9 === 0)
                    && (this_aux.Valida_Seleccion_Calendario10 === 0)
                    && (this_aux.Valida_Seleccion_Calendario11 === 0)) {
                      this_aux.itemSeleccionado = 0;
                      this_aux.clickCal0();
                    } else {
                      this_aux.itemSeleccionado = 1;
                      this_aux.clickCal0();
                      if (this_aux.Valida_Seleccion_Calendario1 === 1) {
                        this_aux.clickCal1();
                      } else if (this_aux.Valida_Seleccion_Calendario2 === 1) {
                        this_aux.clickCal2();
                      } else if (this_aux.Valida_Seleccion_Calendario3 === 1) {
                        this_aux.clickCal3();
                      } else if (this_aux.Valida_Seleccion_Calendario4 === 1) {
                        this_aux.clickCal4();
                      } else if (this_aux.Valida_Seleccion_Calendario5 === 1) {
                        this_aux.clickCal5();
                      } else if (this_aux.Valida_Seleccion_Calendario6 === 1) {
                        this_aux.clickCal6();
                      } else if (this_aux.Valida_Seleccion_Calendario7 === 1) {
                        this_aux.clickCal7();
                      } else if (this_aux.Valida_Seleccion_Calendario8 === 1) {
                        this_aux.clickCal8();
                      } else if (this_aux.Valida_Seleccion_Calendario9 === 1) {
                        this_aux.clickCal9();
                      } else if (this_aux.Valida_Seleccion_Calendario10 === 1) {
                        this_aux.clickCal10();
                      } else if (this_aux.Valida_Seleccion_Calendario11 === 1) {
                        this_aux.clickCal11();
                      }
                    }

              });
            }

            if (elementoCal1 != null) {
              elementoCal1.addEventListener("click", function(event) {
                console.log(this.id);
                if( ((this_aux.Valida_Seleccion_Calendario1 === 0) || (this_aux.Valida_Seleccion_Calendario1 === 1))
                    && (this_aux.Valida_Seleccion_Calendario0 === 0)
                    && (this_aux.Valida_Seleccion_Calendario2 === 0)
                    && (this_aux.Valida_Seleccion_Calendario3 === 0)
                    && (this_aux.Valida_Seleccion_Calendario4 === 0)
                    && (this_aux.Valida_Seleccion_Calendario5 === 0)
                    && (this_aux.Valida_Seleccion_Calendario6 === 0)
                    && (this_aux.Valida_Seleccion_Calendario7 === 0)
                    && (this_aux.Valida_Seleccion_Calendario8 === 0)
                    && (this_aux.Valida_Seleccion_Calendario9 === 0)
                    && (this_aux.Valida_Seleccion_Calendario10 === 0)
                    && (this_aux.Valida_Seleccion_Calendario11 === 0)) {
                      this_aux.itemSeleccionado = 0;
                      this_aux.clickCal1();
                    } else {
                      this_aux.itemSeleccionado = 1;
                      this_aux.clickCal1();
                      if (this_aux.Valida_Seleccion_Calendario0 === 1) {
                        this_aux.clickCal0();
                      } else if (this_aux.Valida_Seleccion_Calendario2 === 1) {
                        this_aux.clickCal2();
                      } else if (this_aux.Valida_Seleccion_Calendario3 === 1) {
                        this_aux.clickCal3();
                      } else if (this_aux.Valida_Seleccion_Calendario4 === 1) {
                        this_aux.clickCal4();
                      } else if (this_aux.Valida_Seleccion_Calendario5 === 1) {
                        this_aux.clickCal5();
                      } else if (this_aux.Valida_Seleccion_Calendario6 === 1) {
                        this_aux.clickCal6();
                      } else if (this_aux.Valida_Seleccion_Calendario7 === 1) {
                        this_aux.clickCal7();
                      } else if (this_aux.Valida_Seleccion_Calendario8 === 1) {
                        this_aux.clickCal8();
                      } else if (this_aux.Valida_Seleccion_Calendario9 === 1) {
                        this_aux.clickCal9();
                      } else if (this_aux.Valida_Seleccion_Calendario10 === 1) {
                        this_aux.clickCal10();
                      } else if (this_aux.Valida_Seleccion_Calendario11 === 1) {
                        this_aux.clickCal11();
                      }
                    }
              });
            }

            if (elementoCal2 != null) {
              elementoCal2.addEventListener("click", function(event) {
                console.log(this.id);
                if( ((this_aux.Valida_Seleccion_Calendario2 === 0) || (this_aux.Valida_Seleccion_Calendario2 === 1))
                    && (this_aux.Valida_Seleccion_Calendario0 === 0)
                    && (this_aux.Valida_Seleccion_Calendario1 === 0)
                    && (this_aux.Valida_Seleccion_Calendario3 === 0)
                    && (this_aux.Valida_Seleccion_Calendario4 === 0)
                    && (this_aux.Valida_Seleccion_Calendario5 === 0)
                    && (this_aux.Valida_Seleccion_Calendario6 === 0)
                    && (this_aux.Valida_Seleccion_Calendario7 === 0)
                    && (this_aux.Valida_Seleccion_Calendario8 === 0)
                    && (this_aux.Valida_Seleccion_Calendario9 === 0)
                    && (this_aux.Valida_Seleccion_Calendario10 === 0)
                    && (this_aux.Valida_Seleccion_Calendario11 === 0)) {
                      this_aux.itemSeleccionado = 0;
                      this_aux.clickCal2();
                    } else {
                      this_aux.itemSeleccionado = 1;
                      this_aux.clickCal2();
                      if (this_aux.Valida_Seleccion_Calendario0 === 1) {
                        this_aux.clickCal0();
                      } else if (this_aux.Valida_Seleccion_Calendario1 === 1) {
                        this_aux.clickCal1();
                      } else if (this_aux.Valida_Seleccion_Calendario3 === 1) {
                        this_aux.clickCal3();
                      } else if (this_aux.Valida_Seleccion_Calendario4 === 1) {
                        this_aux.clickCal4();
                      } else if (this_aux.Valida_Seleccion_Calendario5 === 1) {
                        this_aux.clickCal5();
                      } else if (this_aux.Valida_Seleccion_Calendario6 === 1) {
                        this_aux.clickCal6();
                      } else if (this_aux.Valida_Seleccion_Calendario7 === 1) {
                        this_aux.clickCal7();
                      } else if (this_aux.Valida_Seleccion_Calendario8 === 1) {
                        this_aux.clickCal8();
                      } else if (this_aux.Valida_Seleccion_Calendario9 === 1) {
                        this_aux.clickCal9();
                      } else if (this_aux.Valida_Seleccion_Calendario10 === 1) {
                        this_aux.clickCal10();
                      } else if (this_aux.Valida_Seleccion_Calendario11 === 1) {
                        this_aux.clickCal11();
                      }
                    }
              });
            }

            if (elementoCal3 != null) {
              elementoCal3.addEventListener("click", function(event) {
                console.log(this.id);
                if( ((this_aux.Valida_Seleccion_Calendario3 === 0) || (this_aux.Valida_Seleccion_Calendario3 === 1))
                && (this_aux.Valida_Seleccion_Calendario0 === 0)
                && (this_aux.Valida_Seleccion_Calendario1 === 0)
                && (this_aux.Valida_Seleccion_Calendario2 === 0)
                && (this_aux.Valida_Seleccion_Calendario4 === 0)
                && (this_aux.Valida_Seleccion_Calendario5 === 0)
                && (this_aux.Valida_Seleccion_Calendario6 === 0)
                && (this_aux.Valida_Seleccion_Calendario7 === 0)
                && (this_aux.Valida_Seleccion_Calendario8 === 0)
                && (this_aux.Valida_Seleccion_Calendario9 === 0)
                && (this_aux.Valida_Seleccion_Calendario10 === 0)
                && (this_aux.Valida_Seleccion_Calendario11 === 0)) {
                  this_aux.itemSeleccionado = 0;
                  this_aux.clickCal3();
                } else {
                  this_aux.itemSeleccionado = 1;
                  this_aux.clickCal3();
                  if (this_aux.Valida_Seleccion_Calendario0 === 1) {
                    this_aux.clickCal0();
                  } else if (this_aux.Valida_Seleccion_Calendario1 === 1) {
                    this_aux.clickCal1();
                  } else if (this_aux.Valida_Seleccion_Calendario2 === 1) {
                    this_aux.clickCal2();
                  } else if (this_aux.Valida_Seleccion_Calendario4 === 1) {
                    this_aux.clickCal4();
                  } else if (this_aux.Valida_Seleccion_Calendario5 === 1) {
                    this_aux.clickCal5();
                  } else if (this_aux.Valida_Seleccion_Calendario6 === 1) {
                    this_aux.clickCal6();
                  } else if (this_aux.Valida_Seleccion_Calendario7 === 1) {
                    this_aux.clickCal7();
                  } else if (this_aux.Valida_Seleccion_Calendario8 === 1) {
                    this_aux.clickCal8();
                  } else if (this_aux.Valida_Seleccion_Calendario9 === 1) {
                    this_aux.clickCal9();
                  } else if (this_aux.Valida_Seleccion_Calendario10 === 1) {
                    this_aux.clickCal10();
                  } else if (this_aux.Valida_Seleccion_Calendario11 === 1) {
                    this_aux.clickCal11();
                  }
                }
              });
            }

            if (elementoCal4 != null) {
              elementoCal4.addEventListener("click", function(event) {
                console.log(this.id);
                if( ((this_aux.Valida_Seleccion_Calendario4 === 0) || (this_aux.Valida_Seleccion_Calendario4 === 1))
                && (this_aux.Valida_Seleccion_Calendario0 === 0)
                && (this_aux.Valida_Seleccion_Calendario1 === 0)
                && (this_aux.Valida_Seleccion_Calendario2 === 0)
                && (this_aux.Valida_Seleccion_Calendario3 === 0)
                && (this_aux.Valida_Seleccion_Calendario5 === 0)
                && (this_aux.Valida_Seleccion_Calendario6 === 0)
                && (this_aux.Valida_Seleccion_Calendario7 === 0)
                && (this_aux.Valida_Seleccion_Calendario8 === 0)
                && (this_aux.Valida_Seleccion_Calendario9 === 0)
                && (this_aux.Valida_Seleccion_Calendario10 === 0)
                && (this_aux.Valida_Seleccion_Calendario11 === 0)) {
                  this_aux.itemSeleccionado = 0;
                  this_aux.clickCal4();
                } else {
                  this_aux.itemSeleccionado = 1;
                  this_aux.clickCal4();
                  if (this_aux.Valida_Seleccion_Calendario0 === 1) {
                    this_aux.clickCal0();
                  } else if (this_aux.Valida_Seleccion_Calendario1 === 1) {
                    this_aux.clickCal1();
                  } else if (this_aux.Valida_Seleccion_Calendario2 === 1) {
                    this_aux.clickCal2();
                  } else if (this_aux.Valida_Seleccion_Calendario3 === 1) {
                    this_aux.clickCal3();
                  } else if (this_aux.Valida_Seleccion_Calendario5 === 1) {
                    this_aux.clickCal5();
                  } else if (this_aux.Valida_Seleccion_Calendario6 === 1) {
                    this_aux.clickCal6();
                  } else if (this_aux.Valida_Seleccion_Calendario7 === 1) {
                    this_aux.clickCal7();
                  } else if (this_aux.Valida_Seleccion_Calendario8 === 1) {
                    this_aux.clickCal8();
                  } else if (this_aux.Valida_Seleccion_Calendario9 === 1) {
                    this_aux.clickCal9();
                  } else if (this_aux.Valida_Seleccion_Calendario10 === 1) {
                    this_aux.clickCal10();
                  } else if (this_aux.Valida_Seleccion_Calendario11 === 1) {
                    this_aux.clickCal11();
                  }
                }
              });
            }

            if (elementoCal5 != null) {
              elementoCal5.addEventListener("click", function(event) {
                console.log(this.id);
                if( ((this_aux.Valida_Seleccion_Calendario5 === 0) || (this_aux.Valida_Seleccion_Calendario5 === 1))
                && (this_aux.Valida_Seleccion_Calendario0 === 0)
                && (this_aux.Valida_Seleccion_Calendario1 === 0)
                && (this_aux.Valida_Seleccion_Calendario2 === 0)
                && (this_aux.Valida_Seleccion_Calendario3 === 0)
                && (this_aux.Valida_Seleccion_Calendario4 === 0)
                && (this_aux.Valida_Seleccion_Calendario6 === 0)
                && (this_aux.Valida_Seleccion_Calendario7 === 0)
                && (this_aux.Valida_Seleccion_Calendario8 === 0)
                && (this_aux.Valida_Seleccion_Calendario9 === 0)
                && (this_aux.Valida_Seleccion_Calendario10 === 0)
                && (this_aux.Valida_Seleccion_Calendario11 === 0)) {
                  this_aux.itemSeleccionado = 0;
                  this_aux.clickCal5();
                } else {
                  this_aux.itemSeleccionado = 1;
                  this_aux.clickCal5();
                  if (this_aux.Valida_Seleccion_Calendario0 === 1) {
                    this_aux.clickCal0();
                  } else if (this_aux.Valida_Seleccion_Calendario1 === 1) {
                    this_aux.clickCal1();
                  } else if (this_aux.Valida_Seleccion_Calendario2 === 1) {
                    this_aux.clickCal2();
                  } else if (this_aux.Valida_Seleccion_Calendario3 === 1) {
                    this_aux.clickCal3();
                  } else if (this_aux.Valida_Seleccion_Calendario4 === 1) {
                    this_aux.clickCal4();
                  } else if (this_aux.Valida_Seleccion_Calendario6 === 1) {
                    this_aux.clickCal6();
                  } else if (this_aux.Valida_Seleccion_Calendario7 === 1) {
                    this_aux.clickCal7();
                  } else if (this_aux.Valida_Seleccion_Calendario8 === 1) {
                    this_aux.clickCal8();
                  } else if (this_aux.Valida_Seleccion_Calendario9 === 1) {
                    this_aux.clickCal9();
                  } else if (this_aux.Valida_Seleccion_Calendario10 === 1) {
                    this_aux.clickCal10();
                  } else if (this_aux.Valida_Seleccion_Calendario11 === 1) {
                    this_aux.clickCal11();
                  }
                }
              });
            }


             for (let i = res.length; i>=1; i--) {
    
              // if ( (res.length <= 12) && (res.length >= 7)) {
    
                if ( cont >= 6) {
    
    
                  // $("#calendario").append(
                  //  this.calendario.nativeElement.insertAdjacentHTML(
                  //    this.renderer.invokeElementMethod(this.calendario.nativeElement.insertAdjacentHTML('beforeend',
                  // this.htmlToAdd =
                  // this.calendario.insert(
                    let domContent2 = '<div value ="'+this_aux.obj['fechas'][contFechas].Documento + '"' + 'id="'+'Itemcalendario' + cont + '"' + ' class="kiosk-cec-carousel-item estilo-item-calendar" style="opacity: .5;" >' +
                    '<div value ="'+this_aux.obj['fechas'][contFechas].FechaDoc + '"' + 'id="'+'ItemcalendarioDoc' + cont + '"' + ' class="row no-space">' +
                        '<div class="col-xs-6">' +
                            '<div class="bg-grey-600 white vertical-align height-200 fondo-calendar" >' +
                                '<div class="vertical-align-middle">' +
                                    '<span class="icon-calendar size-icon-calendar" align="center" >' + this_aux.obj['fechas'][contFechas].Dia + '</span>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="col-xs-6">' +
                            '<div class="height-200 item-red-middle">' +
                                '<span class="font-size-30 size-fecha-calendar" >' + this_aux.obj['fechas'][contFechas].Mes  + ' ' +  this_aux.obj['fechas'][contFechas].Anio + '</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
    
                '</div>' ;
    
                creaElement.innerHTML = domContent2;
                objCalendario2.appendChild(creaElement.firstChild);
               //  document.body.appendChild(creaElement.firstChild);
               // objTo.appendChild(this_aux.calendario.nativeElement);
    
                  contFechas --;
              }
    
              cont ++;
    
              if (cont === 12) {
                break;
              }
             }
    
             // Validar seleecion de cada calendario (segundo elemnto carousel)
             let elementoCal6 = document.getElementById('Itemcalendario6');
             let elementoCal7 = document.getElementById('Itemcalendario7');
             let elementoCal8 = document.getElementById('Itemcalendario8');
             let elementoCal9 = document.getElementById('Itemcalendario9');
             let elementoCal10 = document.getElementById('Itemcalendario10');
             let elementoCal11 = document.getElementById('Itemcalendario11');

            if (elementoCal6 != null) {
              elementoCal6.addEventListener("click", function(event) {
                console.log(this.id);
                if( ((this_aux.Valida_Seleccion_Calendario6 === 0) || (this_aux.Valida_Seleccion_Calendario6 === 1))
                    && (this_aux.Valida_Seleccion_Calendario0 === 0)
                    && (this_aux.Valida_Seleccion_Calendario1 === 0)
                    && (this_aux.Valida_Seleccion_Calendario2 === 0)
                    && (this_aux.Valida_Seleccion_Calendario3 === 0)
                    && (this_aux.Valida_Seleccion_Calendario4 === 0)
                    && (this_aux.Valida_Seleccion_Calendario5 === 0)
                    && (this_aux.Valida_Seleccion_Calendario7 === 0)
                    && (this_aux.Valida_Seleccion_Calendario8 === 0)
                    && (this_aux.Valida_Seleccion_Calendario9 === 0)
                    && (this_aux.Valida_Seleccion_Calendario10 === 0)
                    && (this_aux.Valida_Seleccion_Calendario11 === 0)) {
                      this_aux.itemSeleccionado = 0;
                      this_aux.clickCal6();
                    } else {
                      this_aux.itemSeleccionado = 1;
                      this_aux.clickCal6();
                      if (this_aux.Valida_Seleccion_Calendario0 === 1) {
                        this_aux.clickCal0();
                      } else if (this_aux.Valida_Seleccion_Calendario1 === 1) {
                        this_aux.clickCal1();
                      } else if (this_aux.Valida_Seleccion_Calendario2 === 1) {
                        this_aux.clickCal2();
                      } else if (this_aux.Valida_Seleccion_Calendario3 === 1) {
                        this_aux.clickCal3();
                      } else if (this_aux.Valida_Seleccion_Calendario4 === 1) {
                        this_aux.clickCal4();
                      } else if (this_aux.Valida_Seleccion_Calendario5 === 1) {
                        this_aux.clickCal5();
                      } else if (this_aux.Valida_Seleccion_Calendario7 === 1) {
                        this_aux.clickCal7();
                      } else if (this_aux.Valida_Seleccion_Calendario8 === 1) {
                        this_aux.clickCal8();
                      } else if (this_aux.Valida_Seleccion_Calendario9 === 1) {
                        this_aux.clickCal9();
                      } else if (this_aux.Valida_Seleccion_Calendario10 === 1) {
                        this_aux.clickCal10();
                      } else if (this_aux.Valida_Seleccion_Calendario11 === 1) {
                        this_aux.clickCal11();
                      }
                    }
              });
            }

            if (elementoCal7 != null) {
              elementoCal7.addEventListener("click", function(event) {
                console.log(this.id);
                if( ((this_aux.Valida_Seleccion_Calendario7 === 0) || (this_aux.Valida_Seleccion_Calendario7 === 1))
                    && (this_aux.Valida_Seleccion_Calendario0 === 0)
                    && (this_aux.Valida_Seleccion_Calendario1 === 0)
                    && (this_aux.Valida_Seleccion_Calendario2 === 0)
                    && (this_aux.Valida_Seleccion_Calendario3 === 0)
                    && (this_aux.Valida_Seleccion_Calendario4 === 0)
                    && (this_aux.Valida_Seleccion_Calendario5 === 0)
                    && (this_aux.Valida_Seleccion_Calendario6 === 0)
                    && (this_aux.Valida_Seleccion_Calendario8 === 0)
                    && (this_aux.Valida_Seleccion_Calendario9 === 0)
                    && (this_aux.Valida_Seleccion_Calendario10 === 0)
                    && (this_aux.Valida_Seleccion_Calendario11 === 0)) {
                      this_aux.itemSeleccionado = 0;
                      this_aux.clickCal7();
                    } else {
                      this_aux.itemSeleccionado = 1;
                      this_aux.clickCal7();
                      if (this_aux.Valida_Seleccion_Calendario0 === 1) {
                        this_aux.clickCal0();
                      } else if (this_aux.Valida_Seleccion_Calendario1 === 1) {
                        this_aux.clickCal1();
                      } else if (this_aux.Valida_Seleccion_Calendario2 === 1) {
                        this_aux.clickCal2();
                      } else if (this_aux.Valida_Seleccion_Calendario3 === 1) {
                        this_aux.clickCal3();
                      } else if (this_aux.Valida_Seleccion_Calendario4 === 1) {
                        this_aux.clickCal4();
                      } else if (this_aux.Valida_Seleccion_Calendario5 === 1) {
                        this_aux.clickCal5();
                      } else if (this_aux.Valida_Seleccion_Calendario6 === 1) {
                        this_aux.clickCal6();
                      } else if (this_aux.Valida_Seleccion_Calendario8 === 1) {
                        this_aux.clickCal8();
                      } else if (this_aux.Valida_Seleccion_Calendario9 === 1) {
                        this_aux.clickCal9();
                      } else if (this_aux.Valida_Seleccion_Calendario10 === 1) {
                        this_aux.clickCal10();
                      } else if (this_aux.Valida_Seleccion_Calendario11 === 1) {
                        this_aux.clickCal11();
                      }
                    }

              });
            }

            if (elementoCal8 != null) {
              elementoCal8.addEventListener("click", function(event) {
                console.log(this.id);
                if( ((this_aux.Valida_Seleccion_Calendario8 === 0) || (this_aux.Valida_Seleccion_Calendario8 === 1))
                    && (this_aux.Valida_Seleccion_Calendario0 === 0)
                    && (this_aux.Valida_Seleccion_Calendario1 === 0)
                    && (this_aux.Valida_Seleccion_Calendario2 === 0)
                    && (this_aux.Valida_Seleccion_Calendario3 === 0)
                    && (this_aux.Valida_Seleccion_Calendario4 === 0)
                    && (this_aux.Valida_Seleccion_Calendario5 === 0)
                    && (this_aux.Valida_Seleccion_Calendario6 === 0)
                    && (this_aux.Valida_Seleccion_Calendario7 === 0)
                    && (this_aux.Valida_Seleccion_Calendario9 === 0)
                    && (this_aux.Valida_Seleccion_Calendario10 === 0)
                    && (this_aux.Valida_Seleccion_Calendario11 === 0)) {
                      this_aux.itemSeleccionado = 0;
                      this_aux.clickCal8();
                    } else {
                      this_aux.itemSeleccionado = 1;
                      this_aux.clickCal8();
                      if (this_aux.Valida_Seleccion_Calendario0 === 1) {
                        this_aux.clickCal0();
                      } else if (this_aux.Valida_Seleccion_Calendario1 === 1) {
                        this_aux.clickCal1();
                      } else if (this_aux.Valida_Seleccion_Calendario2 === 1) {
                        this_aux.clickCal2();
                      } else if (this_aux.Valida_Seleccion_Calendario3 === 1) {
                        this_aux.clickCal3();
                      } else if (this_aux.Valida_Seleccion_Calendario4 === 1) {
                        this_aux.clickCal4();
                      } else if (this_aux.Valida_Seleccion_Calendario5 === 1) {
                        this_aux.clickCal5();
                      } else if (this_aux.Valida_Seleccion_Calendario6 === 1) {
                        this_aux.clickCal6();
                      } else if (this_aux.Valida_Seleccion_Calendario7 === 1) {
                        this_aux.clickCal7();
                      } else if (this_aux.Valida_Seleccion_Calendario9 === 1) {
                        this_aux.clickCal9();
                      } else if (this_aux.Valida_Seleccion_Calendario10 === 1) {
                        this_aux.clickCal10();
                      } else if (this_aux.Valida_Seleccion_Calendario11 === 1) {
                        this_aux.clickCal11();
                      }
                    }

              });
            }

            if (elementoCal9 != null) {
              elementoCal9.addEventListener("click", function(event) {
                console.log(this.id);
                if( ((this_aux.Valida_Seleccion_Calendario9 === 0) || (this_aux.Valida_Seleccion_Calendario9 === 1))
                    && (this_aux.Valida_Seleccion_Calendario0 === 0)
                    && (this_aux.Valida_Seleccion_Calendario1 === 0)
                    && (this_aux.Valida_Seleccion_Calendario2 === 0)
                    && (this_aux.Valida_Seleccion_Calendario3 === 0)
                    && (this_aux.Valida_Seleccion_Calendario4 === 0)
                    && (this_aux.Valida_Seleccion_Calendario5 === 0)
                    && (this_aux.Valida_Seleccion_Calendario6 === 0)
                    && (this_aux.Valida_Seleccion_Calendario7 === 0)
                    && (this_aux.Valida_Seleccion_Calendario8 === 0)
                    && (this_aux.Valida_Seleccion_Calendario10 === 0)
                    && (this_aux.Valida_Seleccion_Calendario11 === 0)) {
                      this_aux.itemSeleccionado = 0;
                      this_aux.clickCal9();
                    } else {
                      this_aux.itemSeleccionado = 1;
                      this_aux.clickCal9();
                      if (this_aux.Valida_Seleccion_Calendario0 === 1) {
                        this_aux.clickCal0();
                      } else if (this_aux.Valida_Seleccion_Calendario1 === 1) {
                        this_aux.clickCal1();
                      } else if (this_aux.Valida_Seleccion_Calendario2 === 1) {
                        this_aux.clickCal2();
                      } else if (this_aux.Valida_Seleccion_Calendario3 === 1) {
                        this_aux.clickCal3();
                      } else if (this_aux.Valida_Seleccion_Calendario4 === 1) {
                        this_aux.clickCal4();
                      } else if (this_aux.Valida_Seleccion_Calendario5 === 1) {
                        this_aux.clickCal5();
                      } else if (this_aux.Valida_Seleccion_Calendario6 === 1) {
                        this_aux.clickCal6();
                      } else if (this_aux.Valida_Seleccion_Calendario7 === 1) {
                        this_aux.clickCal7();
                      } else if (this_aux.Valida_Seleccion_Calendario8 === 1) {
                        this_aux.clickCal8();
                      } else if (this_aux.Valida_Seleccion_Calendario10 === 1) {
                        this_aux.clickCal10();
                      } else if (this_aux.Valida_Seleccion_Calendario11 === 1) {
                        this_aux.clickCal11();
                      }
                    }

              });
            }

            if (elementoCal10 != null) {
              elementoCal10.addEventListener("click", function(event) {
                console.log(this.id);
                if( ((this_aux.Valida_Seleccion_Calendario10 === 0) || (this_aux.Valida_Seleccion_Calendario10 === 1))
                    && (this_aux.Valida_Seleccion_Calendario0 === 0)
                    && (this_aux.Valida_Seleccion_Calendario1 === 0)
                    && (this_aux.Valida_Seleccion_Calendario2 === 0)
                    && (this_aux.Valida_Seleccion_Calendario3 === 0)
                    && (this_aux.Valida_Seleccion_Calendario4 === 0)
                    && (this_aux.Valida_Seleccion_Calendario5 === 0)
                    && (this_aux.Valida_Seleccion_Calendario6 === 0)
                    && (this_aux.Valida_Seleccion_Calendario7 === 0)
                    && (this_aux.Valida_Seleccion_Calendario8 === 0)
                    && (this_aux.Valida_Seleccion_Calendario9 === 0)
                    && (this_aux.Valida_Seleccion_Calendario11 === 0)) {
                      this_aux.itemSeleccionado = 0;
                      this_aux.clickCal10();
                    } else {
                      this_aux.itemSeleccionado = 1;
                      this_aux.clickCal10();
                      if (this_aux.Valida_Seleccion_Calendario0 === 1) {
                        this_aux.clickCal0();
                      } else if (this_aux.Valida_Seleccion_Calendario1 === 1) {
                        this_aux.clickCal1();
                      } else if (this_aux.Valida_Seleccion_Calendario2 === 1) {
                        this_aux.clickCal2();
                      } else if (this_aux.Valida_Seleccion_Calendario3 === 1) {
                        this_aux.clickCal3();
                      } else if (this_aux.Valida_Seleccion_Calendario4 === 1) {
                        this_aux.clickCal4();
                      } else if (this_aux.Valida_Seleccion_Calendario5 === 1) {
                        this_aux.clickCal5();
                      } else if (this_aux.Valida_Seleccion_Calendario6 === 1) {
                        this_aux.clickCal6();
                      } else if (this_aux.Valida_Seleccion_Calendario7 === 1) {
                        this_aux.clickCal7();
                      } else if (this_aux.Valida_Seleccion_Calendario8 === 1) {
                        this_aux.clickCal8();
                      } else if (this_aux.Valida_Seleccion_Calendario9 === 1) {
                        this_aux.clickCal9();
                      } else if (this_aux.Valida_Seleccion_Calendario11 === 1) {
                        this_aux.clickCal11();
                      }
                    }

              });
            }

            if (elementoCal11 != null) {
              elementoCal11.addEventListener("click", function(event) {
                console.log(this.id);
                if( ((this_aux.Valida_Seleccion_Calendario11 === 0) || (this_aux.Valida_Seleccion_Calendario11 === 1))
                    && (this_aux.Valida_Seleccion_Calendario0 === 0)
                    && (this_aux.Valida_Seleccion_Calendario1 === 0)
                    && (this_aux.Valida_Seleccion_Calendario2 === 0)
                    && (this_aux.Valida_Seleccion_Calendario3 === 0)
                    && (this_aux.Valida_Seleccion_Calendario4 === 0)
                    && (this_aux.Valida_Seleccion_Calendario5 === 0)
                    && (this_aux.Valida_Seleccion_Calendario6 === 0)
                    && (this_aux.Valida_Seleccion_Calendario7 === 0)
                    && (this_aux.Valida_Seleccion_Calendario8 === 0)
                    && (this_aux.Valida_Seleccion_Calendario9 === 0)
                    && (this_aux.Valida_Seleccion_Calendario10 === 0)) {
                      this_aux.itemSeleccionado = 0;
                      this_aux.clickCal11();
                    } else {
                      this_aux.itemSeleccionado = 1;
                      this_aux.clickCal11();
                      if (this_aux.Valida_Seleccion_Calendario0 === 1) {
                        this_aux.clickCal0();
                      } else if (this_aux.Valida_Seleccion_Calendario1 === 1) {
                        this_aux.clickCal1();
                      } else if (this_aux.Valida_Seleccion_Calendario2 === 1) {
                        this_aux.clickCal2();
                      } else if (this_aux.Valida_Seleccion_Calendario3 === 1) {
                        this_aux.clickCal3();
                      } else if (this_aux.Valida_Seleccion_Calendario4 === 1) {
                        this_aux.clickCal4();
                      } else if (this_aux.Valida_Seleccion_Calendario5 === 1) {
                        this_aux.clickCal5();
                      } else if (this_aux.Valida_Seleccion_Calendario6 === 1) {
                        this_aux.clickCal6();
                      } else if (this_aux.Valida_Seleccion_Calendario7 === 1) {
                        this_aux.clickCal7();
                      } else if (this_aux.Valida_Seleccion_Calendario8 === 1) {
                        this_aux.clickCal8();
                      } else if (this_aux.Valida_Seleccion_Calendario9 === 1) {
                        this_aux.clickCal9();
                      } else if (this_aux.Valida_Seleccion_Calendario10 === 1) {
                        this_aux.clickCal10();
                      }
                    }

              });

            }

           console.log(this_aux.obj['fechas']);
              }, 500);
          }
          else{
            setTimeout(() => $('#_modal_please_wait').modal('hide'), 500);
            document.getElementById("mnsError").innerHTML=res[0].MensajeAUsuario;
            $("#errorModal").modal('show');
           
          }
          
          
       
        }
        else{
          setTimeout(() => $('#_modal_please_wait').modal('hide'), 500);
          setTimeout(function(){
           
            this_aux.showErrorSucces2(res);
            },500);
        }
         
          
         
   }, function(error) {
       console.error("Error");
       setTimeout(() => $('#_modal_please_wait').modal('hide'), 500);
      this_aux.showErrorPromise(error);
     });
  }

  // Validar seleccion de los calendarios
   clickCal0() {

     this.cal_Click_0 = 1;
     this.bandera0 ++;
      console.log("val " + this.Valida_Seleccion_Calendario0);
     if(this.bandera0 % 2 === 0  || this.bandera0 === 1 ) {
       // set docuemto
       this.numDocumento =  document.getElementById('Itemcalendario0').getAttribute('value');
       this.fechaCorteDoc = document.getElementById('ItemcalendarioDoc0').getAttribute('value');
       this.Valida_Seleccion_Calendario0 ++;
       this.cuadroCalendario = $("#Itemcalendario0");
       this.cuadroCalendario.css({
         'opacity':'10'
       });
       this.palomita0 = $("#palomita0");
       this.palomita0.css({

 			'visibility':'visible',
 			'opacity':'10',
 	    	'position':'absolute',
 	    	'top': '1px',
 	    	'left': '0px',
 	    	'padding': '15px 21px 25px',
 	    	'margin-left': '2px',
 	    	'margin-top': '2px',
 	    	'background-image': 'url(images/check2.png)',
 	    	'background-repeat': 'no-repeat',
 	    	'display': 'inline-block'

 		});

      console.log("b6: "+this.bandera0);
      this.bloquearBoton = '1';
 	}else {

     this.numDocumento = "";
     this.fechaCorteDoc = "";
 		this.cal_Click_0=0;
 		this.Valida_Seleccion_Calendario0 --;
 		this.cuadroCalendario = $("#Itemcalendario0");
 		this.cuadroCalendario.css({
 	    	'opacity':'.5'
 		});
 		this.palomita0 = $("#palomita0");
 		this.palomita0.css({

 	    	'visibility':'hidden'
 		});
 		// palomita.remove();
 		 console.log("b6: "+ this.bandera0);
      console.log("val "+ this.Valida_Seleccion_Calendario1);
      if(this.itemSeleccionado === 0) {
        this.bloquearBoton = '0';
      }      
 	}

   }

   clickCal1() {

     this.cal_Click_1 = 1;
     this.bandera1 ++;

     if(this.bandera1 % 2 === 0  || this.bandera1 === 1 ) {
       // set docuemto
       this.numDocumento =  document.getElementById('Itemcalendario1').getAttribute('value');
       this.fechaCorteDoc = document.getElementById('ItemcalendarioDoc1').getAttribute('value');
       this.Valida_Seleccion_Calendario1 ++;
       this.cuadroCalendario = $("#Itemcalendario1");
       this.cuadroCalendario.css({
         'opacity':'10'
       });
       this.palomita1 = $("#palomita1");
       this.palomita1.css({

 			'visibility':'visible',
 			'opacity':'10',
 	    	'position':'absolute',
 	    	'top': '1px',
 	    	'left': '0px',
 	    	'padding': '15px 21px 25px',
 	    	'margin-left': '2px',
 	    	'margin-top': '2px',
 	    	'background-image': 'url(images/check2.png)',
 	    	'background-repeat': 'no-repeat',
 	    	'display': 'inline-block'

 		});
     this.bloquearBoton = '1';
 	}else {
     this.numDocumento = "";
     this.fechaCorteDoc = "";
 		this.cal_Click_1=0;
 		this.Valida_Seleccion_Calendario1 --;
 		this.cuadroCalendario = $("#Itemcalendario1");
 		this.cuadroCalendario.css({
 	    	'opacity':'.5'
 		});
 		this.palomita1 = $("#palomita1");
 		this.palomita1.css({

 	    	'visibility':'hidden'
     });
     if(this.itemSeleccionado === 0) {
      this.bloquearBoton = '0';
    }  
 	}

   }

   clickCal2() {

     this.cal_Click_2 = 1;
     this.bandera2 ++;

     if(this.bandera2 % 2 === 0  || this.bandera2 === 1 ) {
       // set docuemto
       this.numDocumento =  document.getElementById('Itemcalendario2').getAttribute('value');
       this.fechaCorteDoc = document.getElementById('ItemcalendarioDoc2').getAttribute('value');
       this.Valida_Seleccion_Calendario2 ++;
       this.cuadroCalendario = $("#Itemcalendario2");
       this.cuadroCalendario.css({
         'opacity':'10'
       });
       this.palomita2 = $("#palomita2");
       this.palomita2.css({

 			'visibility':'visible',
 			'opacity':'10',
 	    	'position':'absolute',
 	    	'top': '1px',
 	    	'left': '0px',
 	    	'padding': '15px 21px 25px',
 	    	'margin-left': '2px',
 	    	'margin-top': '2px',
 	    	'background-image': 'url(images/check2.png)',
 	    	'background-repeat': 'no-repeat',
 	    	'display': 'inline-block'

 		});
     this.bloquearBoton = '1';
 	}else {
     this.numDocumento = "";
     this.fechaCorteDoc = "";
 		this.cal_Click_2=0;
 		this.Valida_Seleccion_Calendario2 --;
 		this.cuadroCalendario = $("#Itemcalendario2");
 		this.cuadroCalendario.css({
 	    	'opacity':'.5'
 		});
 		this.palomita2 = $("#palomita2");
 		this.palomita2.css({

 	    	'visibility':'hidden'
     });
     if(this.itemSeleccionado === 0) {
      this.bloquearBoton = '0';
    }  
 	}

   }

   clickCal3() {

     this.cal_Click_3 = 1;
     this.bandera3 ++;

     if(this.bandera3 % 2 === 0  || this.bandera3 === 1 ) {
       // set docuemto
       this.numDocumento =  document.getElementById('Itemcalendario3').getAttribute('value');
       this.fechaCorteDoc = document.getElementById('ItemcalendarioDoc3').getAttribute('value');
       this.Valida_Seleccion_Calendario3 ++;
       this.cuadroCalendario = $("#Itemcalendario3");
       this.cuadroCalendario.css({
         'opacity':'10'
       });
       this.palomita3 = $("#palomita3");
       this.palomita3.css({

 			'visibility':'visible',
 			'opacity':'10',
 	    	'position':'absolute',
 	    	'top': '1px',
 	    	'left': '0px',
 	    	'padding': '15px 21px 25px',
 	    	'margin-left': '2px',
 	    	'margin-top': '2px',
 	    	'background-image': 'url(images/check2.png)',
 	    	'background-repeat': 'no-repeat',
 	    	'display': 'inline-block'

 		});
     this.bloquearBoton = '1';
 	}else {
     this.numDocumento =  "";
     this.fechaCorteDoc = "";
 		this.cal_Click_3=0;
 		this.Valida_Seleccion_Calendario3 --;
 		this.cuadroCalendario = $("#Itemcalendario3");
 		this.cuadroCalendario.css({
 	    	'opacity':'.5'
 		});
 		this.palomita3 = $("#palomita3");
 		this.palomita3.css({

 	    	'visibility':'hidden'
     });
     if(this.itemSeleccionado === 0) {
      this.bloquearBoton = '0';
    } 
 	}

   }


   clickCal4() {

     this.cal_Click_4 = 1;
     this.bandera4 ++;

     if(this.bandera4 % 2 === 0  || this.bandera4 === 1 ) {
       // set docuemto
       this.numDocumento =  document.getElementById('Itemcalendario4').getAttribute('value');
       this.fechaCorteDoc = document.getElementById('ItemcalendarioDoc4').getAttribute('value');
       this.Valida_Seleccion_Calendario4 ++;
       this.cuadroCalendario = $("#Itemcalendario4");
       this.cuadroCalendario.css({
         'opacity':'10'
       });
       this.palomita4 = $("#palomita4");
       this.palomita4.css({

 			'visibility':'visible',
 			'opacity':'10',
 	    	'position':'absolute',
 	    	'top': '1px',
 	    	'left': '0px',
 	    	'padding': '15px 21px 25px',
 	    	'margin-left': '2px',
 	    	'margin-top': '2px',
 	    	'background-image': 'url(images/check2.png)',
 	    	'background-repeat': 'no-repeat',
 	    	'display': 'inline-block'

 		});
     this.bloquearBoton = '1';
 	}else {
     this.numDocumento =  "";
     this.fechaCorteDoc = "";
 		this.cal_Click_4=0;
 		this.Valida_Seleccion_Calendario4 --;
 		this.cuadroCalendario = $("#Itemcalendario4");
 		this.cuadroCalendario.css({
 	    	'opacity':'.5'
 		});
 		this.palomita4 = $("#palomita4");
 		this.palomita4.css({

 	    	'visibility':'hidden'
     });
     if(this.itemSeleccionado === 0) {
      this.bloquearBoton = '0';
    } 
 	}

   }

   clickCal5() {

     this.cal_Click_5 = 1;
     this.bandera5 ++;

     if(this.bandera5 % 2 === 0  || this.bandera5 === 1 ) {
       // set docuemto
       this.numDocumento =  document.getElementById('Itemcalendario5').getAttribute('value');
       this.fechaCorteDoc = document.getElementById('ItemcalendarioDoc5').getAttribute('value');
       this.Valida_Seleccion_Calendario5 ++;
       this.cuadroCalendario = $("#Itemcalendario5");
       this.cuadroCalendario.css({
         'opacity':'10'
       });
       this.palomita5 = $("#palomita5");
       this.palomita5.css({

 			'visibility':'visible',
 			'opacity':'10',
 	    	'position':'absolute',
 	    	'top': '1px',
 	    	'left': '0px',
 	    	'padding': '15px 21px 25px',
 	    	'margin-left': '2px',
 	    	'margin-top': '2px',
 	    	'background-image': 'url(images/check2.png)',
 	    	'background-repeat': 'no-repeat',
 	    	'display': 'inline-block'

 		});
     this.bloquearBoton = '1';
 	}else {
     this.numDocumento = "";
     this.fechaCorteDoc = "";
 		this.cal_Click_5=0;
 		this.Valida_Seleccion_Calendario5 --;
 		this.cuadroCalendario = $("#Itemcalendario5");
 		this.cuadroCalendario.css({
 	    	'opacity':'.5'
 		});
 		this.palomita5 = $("#palomita5");
 		this.palomita5.css({

 	    	'visibility':'hidden'
     });
     if(this.itemSeleccionado === 0) {
      this.bloquearBoton = '0';
    } 
 	}

   }

   clickCal6() {

     this.cal_Click_6 = 1;
     this.bandera6 ++;

     if(this.bandera6 % 2 === 0  || this.bandera6 === 1 ) {
       // set docuemto
       this.numDocumento =  document.getElementById('Itemcalendario6').getAttribute('value');
       this.fechaCorteDoc = document.getElementById('ItemcalendarioDoc6').getAttribute('value');
       this.Valida_Seleccion_Calendario6 ++;
       this.cuadroCalendario = $("#Itemcalendario6");
       this.cuadroCalendario.css({
         'opacity':'10'
       });
       this.palomita6 = $("#palomita6");
       this.palomita6.css({

 			'visibility':'visible',
 			'opacity':'10',
 	    	'position':'absolute',
 	    	'top': '1px',
 	    	'left': '0px',
 	    	'padding': '15px 21px 25px',
 	    	'margin-left': '2px',
 	    	'margin-top': '2px',
 	    	'background-image': 'url(images/check2.png)',
 	    	'background-repeat': 'no-repeat',
 	    	'display': 'inline-block'

 		});
     this.bloquearBoton = '1';
 	}else {
     this.numDocumento = "";
     this.fechaCorteDoc = "";
 		this.cal_Click_6=0;
 		this.Valida_Seleccion_Calendario6 --;
 		this.cuadroCalendario = $("#Itemcalendario6");
 		this.cuadroCalendario.css({
 	    	'opacity':'.5'
 		});
 		this.palomita6 = $("#palomita6");
 		this.palomita6.css({

 	    	'visibility':'hidden'
     });
     if(this.itemSeleccionado === 0) {
      this.bloquearBoton = '0';
    } 
 	}

   }

   clickCal7() {

     this.cal_Click_7 = 1;
     this.bandera7 ++;

     if(this.bandera7 % 2 === 0  || this.bandera7 === 1 ) {
       // set docuemto
       this.numDocumento =  document.getElementById('Itemcalendario7').getAttribute('value');
       this.fechaCorteDoc = document.getElementById('ItemcalendarioDoc7').getAttribute('value');
       this.Valida_Seleccion_Calendario7 ++;
       this.cuadroCalendario = $("#Itemcalendario7");
       this.cuadroCalendario.css({
         'opacity':'10'
       });
       this.palomita7 = $("#palomita7");
       this.palomita7.css({

 			'visibility':'visible',
 			'opacity':'10',
 	    	'position':'absolute',
 	    	'top': '1px',
 	    	'left': '0px',
 	    	'padding': '15px 21px 25px',
 	    	'margin-left': '2px',
 	    	'margin-top': '2px',
 	    	'background-image': 'url(images/check2.png)',
 	    	'background-repeat': 'no-repeat',
 	    	'display': 'inline-block'

 		});
     this.bloquearBoton = '1';
 	}else {
     this.numDocumento =  "";
     this.fechaCorteDoc = "";
 		this.cal_Click_7=0;
 		this.Valida_Seleccion_Calendario7 --;
 		this.cuadroCalendario = $("#Itemcalendario7");
 		this.cuadroCalendario.css({
 	    	'opacity':'.5'
 		});
 		this.palomita7 = $("#palomita7");
 		this.palomita7.css({

 	    	'visibility':'hidden'
     });
     if(this.itemSeleccionado === 0) {
      this.bloquearBoton = '0';
    } 
 	}

   }

   clickCal8() {

     this.cal_Click_8 = 1;
     this.bandera8 ++;

     if(this.bandera8 % 2 === 0  || this.bandera8 === 1 ) {
       // set docuemto
       this.numDocumento =  document.getElementById('Itemcalendario8').getAttribute('value');
       this.fechaCorteDoc = document.getElementById('ItemcalendarioDoc8').getAttribute('value');
       this.Valida_Seleccion_Calendario8 ++;
       this.cuadroCalendario = $("#Itemcalendario8");
       this.cuadroCalendario.css({
         'opacity':'10'
       });
       this.palomita8 = $("#palomita8");
       this.palomita8.css({

 			'visibility':'visible',
 			'opacity':'10',
 	    	'position':'absolute',
 	    	'top': '1px',
 	    	'left': '0px',
 	    	'padding': '15px 21px 25px',
 	    	'margin-left': '2px',
 	    	'margin-top': '2px',
 	    	'background-image': 'url(images/check2.png)',
 	    	'background-repeat': 'no-repeat',
 	    	'display': 'inline-block'

 		});
     this.bloquearBoton = '1';
 	}else {
     this.numDocumento = "";
     this.fechaCorteDoc = "";
 		this.cal_Click_8=0;
 		this.Valida_Seleccion_Calendario8 --;
 		this.cuadroCalendario = $("#Itemcalendario8");
 		this.cuadroCalendario.css({
 	    	'opacity':'.5'
 		});
 		this.palomita8 = $("#palomita8");
 		this.palomita8.css({

 	    	'visibility':'hidden'
     });
     if(this.itemSeleccionado === 0) {
      this.bloquearBoton = '0';
    } 
 	}

   }

   clickCal9() {

     this.cal_Click_9 = 1;
     this.bandera9 ++;

     if(this.bandera9 % 2 === 0  || this.bandera9 === 1 ) {
       // set docuemto
       this.numDocumento =  document.getElementById('Itemcalendario9').getAttribute('value');
       this.fechaCorteDoc = document.getElementById('ItemcalendarioDoc9').getAttribute('value');
       this.Valida_Seleccion_Calendario9 ++;
       this.cuadroCalendario = $("#Itemcalendario9");
       this.cuadroCalendario.css({
         'opacity':'10'
       });
       this.palomita9 = $("#palomita9");
       this.palomita9.css({

 			'visibility':'visible',
 			'opacity':'10',
 	    	'position':'absolute',
 	    	'top': '1px',
 	    	'left': '0px',
 	    	'padding': '15px 21px 25px',
 	    	'margin-left': '2px',
 	    	'margin-top': '2px',
 	    	'background-image': 'url(images/check2.png)',
 	    	'background-repeat': 'no-repeat',
 	    	'display': 'inline-block'

 		});
     this.bloquearBoton = '1';
 	}else {
     this.numDocumento = "";
     this.fechaCorteDoc = "";
 		this.cal_Click_9=0;
 		this.Valida_Seleccion_Calendario9 --;
 		this.cuadroCalendario = $("#Itemcalendario9");
 		this.cuadroCalendario.css({
 	    	'opacity':'.5'
 		});
 		this.palomita9 = $("#palomita9");
 		this.palomita9.css({

 	    	'visibility':'hidden'
     });
     if(this.itemSeleccionado === 0) {
      this.bloquearBoton = '0';
    } 
 	}

   }

   clickCal10() {

     this.cal_Click_10 = 1;
     this.bandera10 ++;

     if(this.bandera10 % 2 === 0  || this.bandera10 === 1 ) {
       // set docuemto
       this.numDocumento =  document.getElementById('Itemcalendario10').getAttribute('value');
       this.fechaCorteDoc = document.getElementById('ItemcalendarioDoc10').getAttribute('value');
       this.Valida_Seleccion_Calendario10 ++;
       this.cuadroCalendario = $("#Itemcalendario10");
       this.cuadroCalendario.css({
         'opacity':'10'
       });
       this.palomita10 = $("#palomita10");
       this.palomita10.css({

 			'visibility':'visible',
 			'opacity':'10',
 	    	'position':'absolute',
 	    	'top': '1px',
 	    	'left': '0px',
 	    	'padding': '15px 21px 25px',
 	    	'margin-left': '2px',
 	    	'margin-top': '2px',
 	    	'background-image': 'url(images/check2.png)',
 	    	'background-repeat': 'no-repeat',
 	    	'display': 'inline-block'

 		});
     this.bloquearBoton = '1';
 	}else {
     this.numDocumento = "";
     this.fechaCorteDoc = "";
 		this.cal_Click_10=0;
 		this.Valida_Seleccion_Calendario10 --;
 		this.cuadroCalendario = $("#Itemcalendario10");
 		this.cuadroCalendario.css({
 	    	'opacity':'.5'
 		});
 		this.palomita10 = $("#palomita10");
 		this.palomita10.css({

 	    	'visibility':'hidden'
     });
     if(this.itemSeleccionado === 0) {
      this.bloquearBoton = '0';
    } 
 	}

   }

   clickCal11() {

     this.cal_Click_11 = 1;
     this.bandera11 ++;

     if(this.bandera11 % 2 === 0  || this.bandera11 === 1 ) {
       // set docuemto
       this.numDocumento =  document.getElementById('Itemcalendario11').getAttribute('value');
       this.fechaCorteDoc = document.getElementById('ItemcalendarioDoc11').getAttribute('value');
       this.Valida_Seleccion_Calendario11 ++;
       this.cuadroCalendario = $("#Itemcalendario11");
       this.cuadroCalendario.css({
         'opacity':'10'
       });
       this.palomita11 = $("#palomita11");
       this.palomita11.css({

 			'visibility':'visible',
 			'opacity':'10',
 	    	'position':'absolute',
 	    	'top': '1px',
 	    	'left': '0px',
 	    	'padding': '15px 21px 25px',
 	    	'margin-left': '2px',
 	    	'margin-top': '2px',
 	    	'background-image': 'url(images/check2.png)',
 	    	'background-repeat': 'no-repeat',
 	    	'display': 'inline-block'

 		});
     this.bloquearBoton = '1';
 	}else {
     this.numDocumento = "";
     this.fechaCorteDoc = "";
 		this.cal_Click_11=0;
 		this.Valida_Seleccion_Calendario11 --;
 		this.cuadroCalendario = $("#Itemcalendario11");
 		this.cuadroCalendario.css({
 	    	'opacity':'.5'
 		});
 		this.palomita11 = $("#palomita11");
 		this.palomita11.css({

 	    	'visibility':'hidden'
     });
     if(this.itemSeleccionado === 0) {
      this.bloquearBoton = '0';
    } 
 	}

   }

operacion(id) {

  const this_aux = this;
  if (id ===  '1') {
    // Envio por correo

    // Guarda en sesion los datos para obtener el DOC
    this_aux.serviceTdd.fechaCorte = this_aux .fechaCorteDoc;
    this_aux.serviceTdd.numDoc = this_aux .numDocumento;
    this_aux.serviceTdd.idOpe = id;
      
    this_aux.router.navigate(['/impresionEdcTdcFinal']);
  } else {
    // Imprimir
  
    if ( this_aux .cal_Click_0 === 1 || this_aux.cal_Click_1 === 1 || this_aux.cal_Click_2 === 1 ||
      this_aux.cal_Click_3 === 1 || this_aux.cal_Click_4 === 1 || this_aux.cal_Click_5 === 1 ||
      this_aux.cal_Click_6 === 1 || this_aux.cal_Click_7 === 1 || this_aux.cal_Click_8 === 1 ||
      this_aux.cal_Click_9 === 1 || this_aux.cal_Click_10 === 1 || this_aux.cal_Click_11 === 1) {

      //   const nombreDoc = 'D_'+ this.numDocumento+'_' + this.fechaCorteDoc;
         const nombreDoc = 'D_' + this.numDocumento;

          const formParameters = {
            fechaCorte: this_aux.fechaCorteDoc,
           // fechaCorte: 'Thu Feb 01 13:15:05 CDT 2018',
            idDocumento: this_aux.numDocumento,
            id: id
          };

          const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsTdc/resource/obtenerDoc',
            WLResourceRequest.POST
          );
          resourceRequest.setTimeout(100000);
          resourceRequest.sendFormParameters(formParameters).then(
            function(response) {
              //console.log(response.responseText);
              const documento = response.responseJSON;
              

              if ( documento.Id === '1') {
                  if ( documento.PDF !== undefined) {
                    //console.log("info doc", nombreDoc);
                    localStorage.setItem("doc", documento.PDF);
                    localStorage.setItem("nombreDoc", nombreDoc);
                    // strae PDF del respWL
                    // this.doc_1 = documento.PDF;
                    this_aux.nombreDocumento = documento.NombreDoc;
                    $('#infoPrinter').modal('show');
                  }
                  
                  

              } else {
                this_aux.showErrorSucces(documento);
                
             }
           }, function(error) {
              //this_aux.showErrorPromise(error);
       });
      }
    }
  }

  finishPagePrint() {

    const this_aux = this;
    
    this_aux.serviceTdd.validaMail = "0";//preguntar tecua

     this_aux.router.navigate(['/docElectronTdc']);
  }

showErrorSucces(json) {

  console.log(json.Id + json.MensajeAUsuario);
  if (json.Id === '2') {
    document.getElementById('mnsError').innerHTML =   'El servicio no esta disponible, favor de intentar más tarde';
  } else {
    document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
  }
  $('#errorModal').modal('show');
}

cancelarEnvio() {
  const this_aux = this;
  this_aux.router.navigate(['/cancelarEnvioEdcTdc']);
}

consultaCancelacionEDCDomicilio(opcion) {
  $('#_modal_please_wait').modal('show');
 const this_aux = this;

      const formParameters = {
        opcion: opcion,
        solicitud: '',
      };

      const resourceRequest = new WLResourceRequest(
        'adapters/AdapterBanorteSucursAppsTdc/resource/mantoCancelacionEnvioEDC',
        WLResourceRequest.POST
      );
      resourceRequest.setTimeout(30000);
      resourceRequest.sendFormParameters(formParameters).then(
        function(response) {
          setTimeout(function() {
            const detalleMant = response.responseJSON;
            let btnCancelarEnvio = document.getElementById('cancelarEnvioDomicilio');
            if (detalleMant.Id === "1") {
              if (detalleMant.StatusImpresion !== "A") {
                btnCancelarEnvio.style.display = 'initial';
              } else {
                btnCancelarEnvio.style.display = 'none';
              }
            } else {
              btnCancelarEnvio.style.display = 'none';
            }
            setTimeout(() => $('#_modal_please_wait').modal('hide'), 500); 
         }, 3000);
        },
          function(error) {
            console.error("Error");
            setTimeout(() => $('#_modal_please_wait').modal('hide'), 500);
            $('#errorModal').modal('show');
           
          });

}
// consulta TDC
consultaSaldosTarjetas() {
  const this_aux = this;
  const formParameters = { 
  }; 
  
  //console.log(formParameters);
  const resourceRequest = new WLResourceRequest(
    
    'adapters/AdapterBanorteSucursAppsTdc/resource/consultaSaldosTarjetas', WLResourceRequest.POST);
    resourceRequest.setTimeout(30000);
    
    resourceRequest.sendFormParameters(formParameters).then(
      function(response1) {
        //console.log(response1.responseText);

        const detalleSaldos = response1.responseJSON;
      
        if ( detalleSaldos.Id === '1') {
          this_aux.saldoDispoinible = detalleSaldos.SaldoDisponible;
          this_aux.saldoDispoinible = this_aux.saldoDispoinible;
          this_aux.SaldoActual = detalleSaldos.SaldoActual;
          this_aux.NumeroTarjeta = detalleSaldos.NumeroTarjeta;
          this_aux.mascaraNumeroCuenta(this_aux.NumeroTarjeta);
          
          this_aux.mantenimientoEDC();
        } else {
           this_aux.showErrorSucces(detalleSaldos);
           setTimeout(() => $('#_modal_please_wait').modal('hide'), 500);
          
        }
      }, function(error) {
        this_aux.showErrorPromise(error);
        setTimeout(() => $('#_modal_please_wait').modal('hide'), 500);
       
  });
}

mascaraNumeroCuenta(numCtaSel) {
  const tamNumCta = numCtaSel.length;
  const numCta_aux = numCtaSel.substring(tamNumCta - 4, tamNumCta);
  this.numCuenta_show = '************' + numCta_aux;
  return this.numCuenta_show;
}
showErrorPromise(error) {
  // console.log(error);
  // tslint:disable-next-line:max-line-length
  document.getElementById('mnsError').innerHTML =   "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
  
  $('#errorModal').modal('show');
}

showErrorSuccesMoney(json) {
  // console.log(json.Id + json.MensajeAUsuario);
  document.getElementById('msgError').innerHTML =   "No fue posible confirmar la operación. Por favor verifica tu saldo";

  $('#ModalErrorTransaccion').modal('show');
}

showErrorSucces2(json) {

  // console.log(json.Id + json.MensajeAUsuario);
  if (json[0].Id === '2') {
    document.getElementById('mnsError').innerHTML =   'El servicio no esta disponible, favor de intentar más tarde';
  } else {
    document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
  }
  $('#errorModal').modal('show');
}

}

