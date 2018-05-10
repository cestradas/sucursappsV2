import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { SesionBxiService } from '../sesion-bxi.service';
import { OperacionesBXI } from '../operacionesBXI';
import { Autenticacion } from '../autenticacion';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';


declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-impresion-edc',
  templateUrl: './impresion-edc.component.html',
  styles: []
})
export class ImpresionEdcComponent implements OnInit {

  @ViewChild('listaCuentas', { read: ElementRef}) listaCuentas: ElementRef ;
   @ViewChild('calendario', { read: ElementRef}) calendario: ElementRef ;
  // @ViewChild('calendario') d1: ElementRef;
  
  fechas = '{"fechas":[]}';
  obj: any;
 
  bandera0 = 1;
  bandera1 = 1;
  bandera2 = 1;
  bandera3 = 1;
  bandera4 = 1;
  bandera5 = 1;

  cal_Click_0 = 0;
  cal_Click_1 = 0;
  cal_Click_2 = 0;
  cal_Click_3 = 0;
  cal_Click_4 = 0;
  cal_Click_5 = 0;

  Valida_Seleccion_Calendario0 = 0;
  Valida_Seleccion_Calendario1 = 0;
  Valida_Seleccion_Calendario2 = 0;
  Valida_Seleccion_Calendario3 = 0;
  Valida_Seleccion_Calendario4 = 0;
  Valida_Seleccion_Calendario5 = 0;

  cuadroCalendario;

  palomita0;
  palomita1;
  palomita2;
  palomita3;
  palomita4;
  palomita5;


  cuentaOrigenModal = "";

  constructor(private router: Router, private service: SesionBxiService, private renderer: Renderer2) {

  

   }



  ngOnInit() {

    this.fillSelectCuentas();

    
    

    // this.obtenerListaDocs();

    // this.mantenimientoEDC();

    
  }

  fillSelectCuentas() {
    const this_aux = this;
    const cuentasString = this_aux.service.infoCuentas;
    console.log(this_aux.service.infoCuentas);
    const consultaCuentas = JSON.parse(cuentasString);
    const cuentasArray = consultaCuentas.ArrayCuentas;
      cuentasArray.forEach(cuenta => {
          const li =  this.renderer.createElement('li');
          const a = this.renderer.createElement('a');
          const textoCuenta = this.renderer.createText( cuenta.Alias);
          this.renderer.setProperty(a, 'value', cuenta.NoCuenta);
          this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaSeleccionada(event.target); });
          this.renderer.appendChild(a, textoCuenta),
          this.renderer.appendChild(li, a);
          this.renderer.appendChild(this.listaCuentas.nativeElement, li);
    });

  }

  
setDatosCuentaSeleccionada(elementHTML) {

  const this_aux = this;
  console.log(elementHTML);
  const tableOrigen = document.getElementById('tableOrigen');
  const tableDefaultOrigen = document.getElementById('tableDefaultOrigen');
  const lblCuentaOrigen = document.getElementById('lblCuentaOrigen');
  const lblAliasOrigen = document.getElementById('lblAliasOrigen');
  const numCuenta_seleccionada = elementHTML.value;
  const AliasCuenta_seleccionada = elementHTML.text;

  tableOrigen.setAttribute('style', 'display: block');
  tableDefaultOrigen.setAttribute('style', 'display: none');

  lblAliasOrigen.innerHTML = elementHTML.textContent;
  lblAliasOrigen.innerHTML = AliasCuenta_seleccionada.toString();
  lblCuentaOrigen.innerHTML = numCuenta_seleccionada.toString();
  this_aux.service.numCuentaTranPropBanorte = numCuenta_seleccionada;
  this_aux.service.AliasCuentaTranPropBanorte  = AliasCuenta_seleccionada;
  this_aux.cuentaOrigenModal = this_aux.service.numCuentaTranPropBanorte;
  this_aux.getSaldoDeCuenta(numCuenta_seleccionada);

  // desactiva combo cuentas usuario
  $('#dropdownMenu1').prop("disabled", false);

  this.mantenimientoEDC();

  
  
  }

  getSaldoDeCuenta(numCuenta_seleccionada) {
 
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    operacionesbxi.getSaldo(numCuenta_seleccionada).then(
        function(response1) {
          console.log(response1.responseText);
          const detalleSaldos = response1.responseJSON;
          if ( detalleSaldos.Id === '1') {
            const lblSaldoOrigen = document.getElementById('lblSaldoOrigen');
            lblSaldoOrigen.innerHTML = detalleSaldos.SaldoDisponible;
          } else {
            console.log(detalleSaldos.MensajeAUsuario);
          }
        }, function(error) {
    });
  }

  mantenimientoEDC() {

    const this_aux =  this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();

    operacionesbxi.mantEDC(this_aux.service.numCuentaTranPropBanorte).then(
    //  operacionesbxi.mantEDC("0100000034").then(
      function(response) {
        console.log(response.responseText);
        const detalleMant = response.responseJSON;
        
        this_aux.obtenerListaDocs();

      },
        function(error) {

          console.error("Error");
     
          $('#errorModal').modal('show');
          

        });
    

  }


  obtenerListaDocs() {
    const this_aux =  this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    
    
    operacionesbxi.getListaDocumentos().then(
      function(response) {

        // console.log(response.responseText);
        let res = response.responseJSON;

        console.log(res);

        this_aux.obj = JSON.parse(this_aux.fechas);

        for (let i = 0 ; i < res.length; i++) {
           
          
          let temp = res[i].Fecha.split("-");


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
                "Dia" : strD
              });

              break;
            }


          }

          
       }

       let cont = 0;
       let contFechas = this_aux.obj.fechas.length - 1;
       let creaElement = document.createElement('div');
       let objCalendario1 = document.getElementById('calendario');
       let objCalendario2 = document.getElementById('calendario2');
       // let domString = '<div class="container"><span class="intro">Hello</span> <span id="name"> World!</span></div>';
       

       for (let i = res.length; i--;) {

        // if ( (res.length <= 12) && (res.length >= 7)) {
         
          if ( cont <= 5) {


            // $("#calendario").append(
            //  this.calendario.nativeElement.insertAdjacentHTML(
            //    this.renderer.invokeElementMethod(this.calendario.nativeElement.insertAdjacentHTML('beforeend', 
            // this.htmlToAdd =
            // this.calendario.insert(
              let domContent = '<div  id=' + 'Itemcalendario' + cont + ' class="kiosk-cec-carousel-item estilo-item-calendar" >' +
              '<div class="row no-space">' +
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

      elementoCal0.addEventListener("click", function(event) {
        console.log(this.id);
        if( ((this_aux.Valida_Seleccion_Calendario0 === 0) || (this_aux.Valida_Seleccion_Calendario0 === 1)) 
            && (this_aux.Valida_Seleccion_Calendario1 === 0)
            && (this_aux.Valida_Seleccion_Calendario2 === 0)
            && (this_aux.Valida_Seleccion_Calendario3 === 0)
            && (this_aux.Valida_Seleccion_Calendario4 === 0)
            && (this_aux.Valida_Seleccion_Calendario5 === 0)) {

              this_aux.clickCal0(); 
            }
        
      });
      elementoCal1.addEventListener("click", function(event) {
        console.log(this.id);
        if( ((this_aux.Valida_Seleccion_Calendario1 === 0) || (this_aux.Valida_Seleccion_Calendario1 === 1)) 
            && (this_aux.Valida_Seleccion_Calendario0 === 0)
            && (this_aux.Valida_Seleccion_Calendario2 === 0)
            && (this_aux.Valida_Seleccion_Calendario3 === 0)
            && (this_aux.Valida_Seleccion_Calendario4 === 0)
            && (this_aux.Valida_Seleccion_Calendario5 === 0)) {
              this_aux.clickCal1(); 
            }
      });
      elementoCal2.addEventListener("click", function(event) {
        console.log(this.id);
        if( ((this_aux.Valida_Seleccion_Calendario1 === 0) || (this_aux.Valida_Seleccion_Calendario1 === 1)) 
            && (this_aux.Valida_Seleccion_Calendario0 === 0)
            && (this_aux.Valida_Seleccion_Calendario2 === 0)
            && (this_aux.Valida_Seleccion_Calendario3 === 0)
            && (this_aux.Valida_Seleccion_Calendario4 === 0)
            && (this_aux.Valida_Seleccion_Calendario5 === 0)) {
                this_aux.clickCal2(); 
            }
      });
      elementoCal3.addEventListener("click", function(event) {
        console.log(this.id);
        if( ((this_aux.Valida_Seleccion_Calendario2 === 0) || (this_aux.Valida_Seleccion_Calendario2 === 1)) 
        && (this_aux.Valida_Seleccion_Calendario0 === 0)
        && (this_aux.Valida_Seleccion_Calendario1 === 0)
        && (this_aux.Valida_Seleccion_Calendario3 === 0)
        && (this_aux.Valida_Seleccion_Calendario4 === 0)
        && (this_aux.Valida_Seleccion_Calendario5 === 0)) {
          this_aux.clickCal3(); 
        }
      });
      elementoCal4.addEventListener("click", function(event) {
        console.log(this.id);
        this_aux.clickCal4(); 
      });
      elementoCal5.addEventListener("click", function(event) {
        console.log(this.id);
        this_aux.clickCal5(); 
      });

       for (let i = res.length; i--;) {

        // if ( (res.length <= 12) && (res.length >= 7)) {
         
          if ( cont >= 6) {


            // $("#calendario").append(
            //  this.calendario.nativeElement.insertAdjacentHTML(
            //    this.renderer.invokeElementMethod(this.calendario.nativeElement.insertAdjacentHTML('beforeend', 
            // this.htmlToAdd =
            // this.calendario.insert(
              let domContent2 = '<div class="kiosk-cec-carousel-item estilo-item-calendar" ng-click="onPeriodoItemClick(item, $event)">' +
              '<div class="row no-space">' +
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
       

       console.log(this_aux.obj['fechas']);

      },
        function(error) {

          console.error("Error");
     
          $('#errorModal').modal('show');
          

        });
  }


  // Validar seleccion de los calendarios
  clickCal0() {

    this.cal_Click_0 = 1;
    this.bandera0 ++;
     console.log("val " + this.Valida_Seleccion_Calendario0);
    if(this.bandera0 % 2 === 0  || this.bandera0 === 1 ) {
      this.Valida_Seleccion_Calendario0 ++;
      this.cuadroCalendario = $("#Itemcalendario0");
      this.cuadroCalendario.css({
        'opacity':'.5'
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
	}else {
		this.cal_Click_0=0;
		this.Valida_Seleccion_Calendario0 --;
		this.cuadroCalendario = $("#Itemcalendario0");
		this.cuadroCalendario.css({
	    	'opacity':'10'    
		});	
		this.palomita0 = $("#palomita0");
		this.palomita0.css({
	    	
	    	'visibility':'hidden'
		});
		// palomita.remove();
		 console.log("b6: "+ this.bandera0);
		 console.log("val "+ this.Valida_Seleccion_Calendario1);
	}

  }

  clickCal1() {

    this.cal_Click_1 = 1;
    this.bandera1 ++;
 
    if(this.bandera1 % 2 === 0  || this.bandera1 === 1 ) {
      this.Valida_Seleccion_Calendario1 ++;
      this.cuadroCalendario = $("#Itemcalendario1");
      this.cuadroCalendario.css({
        'opacity':'.5'
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

	}else {
		this.cal_Click_1=0;
		this.Valida_Seleccion_Calendario1 --;
		this.cuadroCalendario = $("#Itemcalendario1");
		this.cuadroCalendario.css({
	    	'opacity':'10'    
		});	
		this.palomita1 = $("#palomita1");
		this.palomita1.css({
	    	
	    	'visibility':'hidden'
		});
	}

  }

  clickCal2() {

    this.cal_Click_2 = 1;
    this.bandera2 ++;
 
    if(this.bandera2 % 2 === 0  || this.bandera2 === 1 ) {
      this.Valida_Seleccion_Calendario2 ++;
      this.cuadroCalendario = $("#Itemcalendario2");
      this.cuadroCalendario.css({
        'opacity':'.5'
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

	}else {
		this.cal_Click_2=0;
		this.Valida_Seleccion_Calendario2 --;
		this.cuadroCalendario = $("#Itemcalendario2");
		this.cuadroCalendario.css({
	    	'opacity':'10'    
		});	
		this.palomita2 = $("#palomita2");
		this.palomita2.css({
	    	
	    	'visibility':'hidden'
		});
	}

  }

  clickCal3() {

    this.cal_Click_3 = 1;
    this.bandera3 ++;
 
    if(this.bandera3 % 2 === 0  || this.bandera3 === 1 ) {
      this.Valida_Seleccion_Calendario3 ++;
      this.cuadroCalendario = $("#Itemcalendario3");
      this.cuadroCalendario.css({
        'opacity':'.5'
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

	}else {
		this.cal_Click_3=0;
		this.Valida_Seleccion_Calendario3 --;
		this.cuadroCalendario = $("#Itemcalendario3");
		this.cuadroCalendario.css({
	    	'opacity':'10'    
		});	
		this.palomita3 = $("#palomita3");
		this.palomita3.css({
	    	
	    	'visibility':'hidden'
		});
	}

  }


  clickCal4() {

    this.cal_Click_4 = 1;
    this.bandera4 ++;
 
    if(this.bandera4 % 2 === 0  || this.bandera4 === 1 ) {
      this.Valida_Seleccion_Calendario4 ++;
      this.cuadroCalendario = $("#Itemcalendario4");
      this.cuadroCalendario.css({
        'opacity':'.5'
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

	}else {
		this.cal_Click_4=0;
		this.Valida_Seleccion_Calendario4 --;
		this.cuadroCalendario = $("#Itemcalendario4");
		this.cuadroCalendario.css({
	    	'opacity':'10'    
		});	
		this.palomita4 = $("#palomita4");
		this.palomita4.css({
	    	
	    	'visibility':'hidden'
		});
	}

  }

  clickCal5() {

    this.cal_Click_5 = 1;
    this.bandera5 ++;
 
    if(this.bandera5 % 2 === 0  || this.bandera5 === 1 ) {
      this.Valida_Seleccion_Calendario5 ++;
      this.cuadroCalendario = $("#Itemcalendario5");
      this.cuadroCalendario.css({
        'opacity':'.5'
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

	}else {
		this.cal_Click_5=0;
		this.Valida_Seleccion_Calendario5 --;
		this.cuadroCalendario = $("#Itemcalendario5");
		this.cuadroCalendario.css({
	    	'opacity':'10'    
		});	
		this.palomita5 = $("#palomita5");
		this.palomita5.css({
	    	
	    	'visibility':'hidden'
		});
	}

  }


  operacion(id) {

    const this_aux = this;

    if (id ===  '1') {
      // Envio por correo

      this_aux.router.navigate(['/impresion_EDC_Finish']);

    } else {
      // Imprimir

    }


  }

}
