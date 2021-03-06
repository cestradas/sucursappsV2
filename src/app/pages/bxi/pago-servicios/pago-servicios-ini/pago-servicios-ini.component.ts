import { SesionBxiService } from './../../sesion-bxi.service';
import { OperacionesBXI } from './../../operacionesBXI';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';


declare var jquery: any; // jquery
declare var $: any;


@Component({
  selector: 'app-pago-servicios-ini',
  templateUrl: './pago-servicios-ini.component.html',
  styleUrls: []
})
export class PagoServiciosIniComponent implements OnInit {

  @ViewChild('facturador', { read: ElementRef}) facturador: ElementRef ;
  @ViewChild('listaCuentas', { read: ElementRef}) listaCuentas: ElementRef ;
  arrayEmpresas: Array<any> = [];
  listaEmpresas:  Array<any> = [];
  listaEmpresasAux: Array<any> = [];
  showOptions: Boolean = false;
  empresaInLocal: string ;
  myForm: FormGroup;
  empresaSelect: Boolean = false ;
  nombreEmpresaSelect: string;
  SaldoOrigen: number;


   constructor( private fb: FormBuilder, private router: Router, private service: SesionBxiService, private renderer: Renderer2) {
    this.myForm = this.fb.group({
      fcFacturador: ['', [Validators.required]],
    });
  }
   ngOnInit() {
    $( ".cdk-visually-hidden" ).css( "margin-top", "30%" );
       this.fillSelectCuentas();
       this.getEmpresas();

       // ESTILOS Preferente
    let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    let btnContinuar = document.getElementById("contiuar");

    if (storageTipoClienteBEL === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }
   }

   saveData() {

     const empresaSelect = this.facturador.nativeElement.value;
     this.getIdEmpresa(empresaSelect);
   }

   fillSelectCuentas() {
             const this_aux = this;
             const cuentasString = this_aux.service.infoCuentas;
             // console.log(this_aux.service.infoCuentas);
             const consultaCuentas = JSON.parse(cuentasString);
             const cuentasArray = consultaCuentas.ArrayCuentas;
               cuentasArray.forEach(cuenta => {
                this_aux.filtraCtaVista(cuenta);
             });
    }

    filtraCtaVista(cuenta) {
      const this_aux = this;
      // tslint:disable-next-line:max-line-length
      if ((cuenta.TipoCuenta === 1  && cuenta.NoCuenta.length === 10) || (cuenta.TipoCuenta === 4 &&  cuenta.NoCuenta.length === 10) || (cuenta.TipoCuenta === 5 &&  cuenta.NoCuenta.length === 16 )) {  
        this_aux.crearListaCuentas(cuenta);
      } 
    }
      
     crearListaCuentas(cuenta) {
      const this_aux = this;
      const operacionesbxi: OperacionesBXI = new OperacionesBXI();
      const li =  this_aux.renderer.createElement('li');
      this_aux.renderer.addClass(li, 'text-li');
      const a = this_aux.renderer.createElement('a');
      const textoCuenta = this_aux.renderer.createText( cuenta.Alias + ' ' + operacionesbxi.mascaraNumeroCuenta(cuenta.NoCuenta));
      this.renderer.setProperty(a, 'value', cuenta.NoCuenta);
      this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaSeleccionada(event.target); });
      this.renderer.appendChild(a, textoCuenta),
      this.renderer.appendChild(li, a);
      this.renderer.appendChild(this_aux.listaCuentas.nativeElement, li);
     }

     setDatosCuentaSeleccionada(elementHTML) {

       $('#_modal_please_wait').modal('show');
       const this_aux = this;
       const operacionesbxi: OperacionesBXI = new OperacionesBXI();
       // console.log(elementHTML);
       const tableOrigen = document.getElementById('tableOrigen');
       const tableDefaultOrigen = document.getElementById('tableDefaultOrigen');
       const lblCuentaOrigen = document.getElementById('lblCuentaOrigen');
       const lblAliasOrigen = document.getElementById('lblAliasOrigen');
       const numCuenta_seleccionada = elementHTML.value;

       tableOrigen.setAttribute('style', 'display: block');
       tableDefaultOrigen.setAttribute('style', 'display: none');

       lblAliasOrigen.innerHTML = this_aux.getCtaFromTextContet(elementHTML.textContent);
       lblCuentaOrigen.innerHTML = operacionesbxi.mascaraNumeroCuenta( numCuenta_seleccionada.toString());
       this_aux.service.numCuentaSeleccionado = numCuenta_seleccionada;
       this_aux.actualizaEmpresasXtipoPago(numCuenta_seleccionada);
       this_aux.getSaldoDeCuenta(numCuenta_seleccionada);
     }

     getSaldoDeCuenta(numCuenta_seleccionada) {
       // console.log(numCuenta_seleccionada.length);
       const this_aux = this;
       this_aux.facturador.nativeElement.value = "";
      if (numCuenta_seleccionada.length === 16) {
           this.getSaldoTDC(numCuenta_seleccionada);
      } else {
          this.getSaldoTDDOtras(numCuenta_seleccionada);
      }
     }

     getSaldoTDDOtras(numCuenta_seleccionada) {
      const this_aux = this;
      const operacionesbxi: OperacionesBXI = new OperacionesBXI();
      operacionesbxi.getSaldo(numCuenta_seleccionada).then(
          function(response1) {
            // console.log(response1.responseText);
            const detalleSaldos = response1.responseJSON;
            if ( detalleSaldos.Id === '1') {

             setTimeout(function() {
              
               this_aux.SaldoOrigen = detalleSaldos.SaldoDisponible;
               document.getElementById("tipoSaldo").innerHTML = "Saldo Disponible";
                $('#_modal_please_wait').modal('hide');
                const facturador = document.getElementById("facturador");
                this_aux.setValue("");
              }, 500);
            } else {
             this_aux.SaldoOrigen = 0;
             setTimeout(function() { 
             $('#_modal_please_wait').modal('hide');
               this_aux.showErrorSucces(detalleSaldos);
             }, 500);
            }
          }, function(error) {
          
          this_aux.SaldoOrigen = 0;
           setTimeout(function() {
             $('#_modal_please_wait').modal('hide');
               this_aux.showErrorPromise(error);
           }, 500);
      });
     }

     getSaldoTDC(numCuenta_seleccionada) {
      const this_aux = this;
      const operacionesbxi: OperacionesBXI = new OperacionesBXI();
      operacionesbxi.getSaldoTDC(numCuenta_seleccionada).then(
          function(response1) {
            // console.log(response1.responseText);
            const detalleSaldos = response1.responseJSON;
            if ( detalleSaldos.Id === '1') {

             setTimeout(function() {

               this_aux.SaldoOrigen = detalleSaldos.SaldoActual;
               document.getElementById("tipoSaldo").innerHTML = "Saldo Actual";
                $('#_modal_please_wait').modal('hide');
                const facturador = document.getElementById("facturador");
                this_aux.setValue("");
              }, 500);
              
            } else {
             this_aux.SaldoOrigen = 0;
             setTimeout(function() { 
             $('#_modal_please_wait').modal('hide');
               this_aux.showErrorSucces(detalleSaldos);
             }, 500);
            }
          }, function(error) {
          
          this_aux.SaldoOrigen = 0;
           setTimeout(function() {
             $('#_modal_please_wait').modal('hide');
               this_aux.showErrorPromise(error);
           }, 500);
      });
     }

getEmpresas() {

      const this_aux = this;
      if (localStorage.getItem('Facturadores') !== null) {

        setTimeout(function() {
           const facturadores =  localStorage.getItem('Facturadores').toString();
           this_aux.arrayEmpresas = JSON.parse(facturadores);

           this_aux.arrayEmpresas.forEach(empresa => {
             const descripcion = empresa.Descripcion;
              this_aux.listaEmpresas.push(descripcion);
           });
           // console.log(this_aux.listaEmpresas);
           this_aux.listaEmpresasAux = this_aux.listaEmpresas;
           $('#_modal_please_wait').modal('hide');
        }, 500);
      } else {

          const operacionesbxi: OperacionesBXI = new OperacionesBXI();
          operacionesbxi.consultaEmpresas().then(
          function(response) {
                // console.log(response.responseJSON);
                const consultaEmpresas = response.responseJSON;
                if (consultaEmpresas.Id === '1') {

                    setTimeout(function() {
                      this_aux.arrayEmpresas = consultaEmpresas.Facturadores;
                      localStorage.setItem('Facturadores', JSON.stringify(this_aux.arrayEmpresas ));
                      this_aux.arrayEmpresas.forEach(empresa => {
                            const descripcion = empresa.Descripcion;
                            const idEmpresa = empresa.IdFacturador;
                            this_aux.listaEmpresas.push(descripcion);
                        });
                      // console.log(this_aux.listaEmpresas);
                      this_aux.listaEmpresasAux = this_aux.listaEmpresas;
                      $('#_modal_please_wait').modal('hide');

                    }, 500);
                  } else {

                    setTimeout(function() {
                      $('#_modal_please_wait').modal('hide');
                      this_aux.showErrorSucces(consultaEmpresas);
                    }, 500);
                }

              }, function(error) {
                setTimeout(function() {
                  $('#_modal_please_wait').modal('hide');
                  this_aux.showErrorPromise(error);
                });
              });
      }
}

     getIdEmpresa(empresaSeleccionada: string) {
         const this_aux =  this;
         // console.log(empresaSeleccionada);
         // console.log(this_aux.arrayEmpresas);
         let valueFacturador: string;
         const arrayFacturadores = this_aux.arrayEmpresas;
         arrayFacturadores.forEach(empresa => {
           const descripcion = empresa.Descripcion;
           if ( descripcion === empresaSeleccionada) {
                 valueFacturador = empresa.IdFacturador;
           }
         });
         if (valueFacturador === undefined) {

          document.getElementById('mnsError').innerHTML = "Servicio invalidado, verifica tu elección.";
          $('#errorModal').modal('show');

         } else {
          this_aux.service.idFacturador = valueFacturador;
          this_aux.getDetalleEmpresa(valueFacturador);
         }
     }

     getDetalleEmpresa(idFacturador) {
      $('#_modal_please_wait').modal('show');
       const this_aux =  this;
       const operacionesbxi: OperacionesBXI = new OperacionesBXI();
       operacionesbxi.consultaDetalleEmpresa(idFacturador).then(
           function(response) {
             // console.log(response.responseText);
             const detalleEmpresa = response.responseJSON;
             const body = $('body');
             if (detalleEmpresa.Id === '1') {
              this_aux.service.detalleEmpresa_PS = response.responseText;

                  // body.off('click');
                  this_aux.router.navigate(['/pagoservicios_detail']);

             } else {
                setTimeout(function() {
                  $('#_modal_please_wait').modal('hide');
                        this_aux.showErrorSucces(detalleEmpresa);  
                }, 500);          
             }
           }, function(error) {
            setTimeout(function() {
            $('#_modal_please_wait').modal('hide');
                this_aux.showErrorPromise(error);
            }, 500);
           });
     }

     muestraFacturadores() {

       const this_aux = this;
       console.log('muestraFacturadores');
       this_aux.setClickOnBody();
     }

     setValue(value) {

       const this_aux = this;
      this_aux.facturador.nativeElement.value = value ;
      const control: FormControl = new FormControl(value, Validators.required);
      this_aux.myForm.setControl('fcFacturador', control );
      this_aux.nombreEmpresaSelect = value;
      this_aux.showOptions = false;
      this_aux.empresaSelect = true;
      }

     setClickOnBody() {
       console.log('click');
       const this_aux = this;
       const body = $('body');

     body.on('click', function() {

      // console.log( this_aux.facturador.nativeElement.value);
      const auxOption = [];
      const valueInput = this_aux.facturador.nativeElement.value;

              if (valueInput.toUpperCase() === '') {
                this_aux.showOptions = false;

              } else {
                if (  this_aux.empresaSelect) {
                  this_aux.showOptions = false; 
                    
                    if (this_aux.nombreEmpresaSelect !== valueInput) {
                      this_aux.empresaSelect = false;
                    } 
                } else {
                  this_aux.showOptions = true;
                }
                
                this_aux.listaEmpresas = this_aux.listaEmpresasAux;
                this_aux.listaEmpresas.forEach(element => {
                  if (element.includes(valueInput.toUpperCase())) {
                    auxOption.push(element);
                  } });

                    this_aux.listaEmpresas = auxOption;
                    }

     });
   }

   showErrorPromise(error) {
      $('#errorModal').modal('show');
      if (error.errorCode === 'API_INVOCATION_FAILURE') {
          document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
      } else {
        document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
      }
  }

  showErrorSucces(json) {

    
    // console.log(json.Id + json.MensajeAUsuario);
    if (json.Id === '2') {
      document.getElementById('mnsError').innerHTML =   'El servicio no esta disponible, favor de intentar mas tarde';
    } else {
      document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
    }
    $('#errorModal').modal('show');
}

  irMenuBXI() {
    this.router.navigate(['/menuBXI']);
  }

    actualizaEmpresasXtipoPago(numCtaSelec) {
      const this_aux = this;
      const cuentasString = this_aux.service.infoCuentas;
      const consultaCuentas = JSON.parse(cuentasString);
      const cuentasArray = consultaCuentas.ArrayCuentas;
      let tipoCuenta;
        cuentasArray.forEach(cuenta => {
            if (cuenta.NoCuenta === numCtaSelec) {
               
              tipoCuenta = cuenta.TipoCuenta;
            }
      });

      this_aux.listaEmpresas = [];
      const facturadores =  localStorage.getItem('Facturadores').toString();
      this_aux.arrayEmpresas = JSON.parse(facturadores);
      if (tipoCuenta === 5) {
          // filtro empresas con 
          this_aux.service.formaPago = "6";
          this_aux.arrayEmpresas.forEach(empresa => {
            if (empresa.IdFacturador === '1310' || empresa.IdFacturador === '88924') {
              // empresa no valida con este tipo de cuenta
            } else {
              const tipoPago = empresa.TipoPago; 
              if ( tipoPago.includes("06")) {
                this_aux.listaEmpresas.push(empresa.Descripcion);
              }
            }
          });
          // console.log(this_aux.listaEmpresas);
          this_aux.listaEmpresasAux = this_aux.listaEmpresas;
      } else if ( tipoCuenta === 4 || tipoCuenta === 1) {
          this_aux.service.formaPago = "4";
          this_aux.arrayEmpresas.forEach(empresa => {
           const tipoPago = empresa.TipoPago; 
            if ( tipoPago.includes("04")) {
              this_aux.listaEmpresas.push(empresa.Descripcion);
            }
          });
          // console.log(this_aux.listaEmpresas);
          this_aux.listaEmpresasAux = this_aux.listaEmpresas;
      }  else {
        this_aux.service.formaPago = "4";
        this_aux.arrayEmpresas.forEach(empresa => {
          const tipoPago = empresa.TipoPago; 
             this_aux.listaEmpresas.push(empresa.Descripcion);
           
         });
         // console.log(this_aux.listaEmpresas);
         this_aux.listaEmpresasAux = this_aux.listaEmpresas;
      }
    }

    getCtaFromTextContet(textContent) {
    
      const re = /\*/g;
      const reNum = /\d/g;
      let textContentAux = textContent.replace(re, '');
      textContentAux = textContentAux.replace(reNum, '');
      // console.log(textContentAux);
  
      return textContentAux;
  
    }
 }
