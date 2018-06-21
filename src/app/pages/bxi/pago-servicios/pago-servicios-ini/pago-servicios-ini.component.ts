import { SesionBxiService } from './../../sesion-bxi.service';
import { OperacionesBXI } from './../../operacionesBXI';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { FUNCTION_TYPE } from '@angular/compiler/src/output/output_ast';

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


   constructor( private fb: FormBuilder, private router: Router, private service: SesionBxiService, private renderer: Renderer2) {
    this.myForm = this.fb.group({
      fcFacturador: ['', [Validators.required]],
    });
  }
   ngOnInit() {
    $( ".cdk-visually-hidden" ).css( "margin-top", "17%" );
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

       $('#_modal_please_wait').modal('show');
       const this_aux = this;
       console.log(elementHTML);
       const tableOrigen = document.getElementById('tableOrigen');
       const tableDefaultOrigen = document.getElementById('tableDefaultOrigen');
       const lblCuentaOrigen = document.getElementById('lblCuentaOrigen');
       const lblAliasOrigen = document.getElementById('lblAliasOrigen');
       const numCuenta_seleccionada = elementHTML.value;

       tableOrigen.setAttribute('style', 'display: block');
       tableDefaultOrigen.setAttribute('style', 'display: none');

       lblAliasOrigen.innerHTML = elementHTML.textContent;
       lblCuentaOrigen.innerHTML = numCuenta_seleccionada.toString();
       this_aux.service.numCuentaSeleccionado = numCuenta_seleccionada;
       this_aux.actualizaEmpresasXtipoPago(numCuenta_seleccionada);
       this_aux.getSaldoDeCuenta(numCuenta_seleccionada);
     }

     getSaldoDeCuenta(numCuenta_seleccionada) {
       const this_aux = this;
       const operacionesbxi: OperacionesBXI = new OperacionesBXI();
       operacionesbxi.getSaldo(numCuenta_seleccionada).then(
           function(response1) {
             console.log(response1.responseText);
             const detalleSaldos = response1.responseJSON;
             if ( detalleSaldos.Id === '1') {

              setTimeout(function() {
                const lblSaldoOrigen = document.getElementById('lblSaldoOrigen');
                lblSaldoOrigen.innerHTML = detalleSaldos.SaldoDisponible;
                 $('#_modal_please_wait').modal('hide');
               }, 500);
             } else {
              setTimeout(function() { 
              $('#_modal_please_wait').modal('hide');
                this_aux.showErrorSucces(detalleSaldos);
              }, 500);
             }
           }, function(error) {

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
           console.log(this_aux.listaEmpresas);
           this_aux.listaEmpresasAux = this_aux.listaEmpresas;
           $('#_modal_please_wait').modal('hide');
        }, 500);
      } else {

          const operacionesbxi: OperacionesBXI = new OperacionesBXI();
          operacionesbxi.consultaEmpresas().then(
          function(response) {
                console.log(response.responseJSON);
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
                      console.log(this_aux.listaEmpresas);
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
         console.log(empresaSeleccionada);
         console.log(this_aux.arrayEmpresas);
         let valueFacturador: string;
         const arrayFacturadores = this_aux.arrayEmpresas;
         arrayFacturadores.forEach(empresa => {
           const descripcion = empresa.Descripcion;
           if ( descripcion === empresaSeleccionada) {
                 valueFacturador = empresa.IdFacturador;
           }
         });
         if (valueFacturador === undefined) {

          document.getElementById('mnsError').innerHTML = "Servicio invalidado, verifica tu elección;";
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
             console.log(response.responseText);
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

       const aux_this = this;
       const body = $('body');
      // body.off('click');
       aux_this.facturador.nativeElement.value = value ;
       aux_this.showOptions = false;
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

                this_aux.showOptions = true;
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


      console.log(json.Id + json.MensajeAUsuario);
      document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
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

          this_aux.arrayEmpresas.forEach(empresa => {
            const tipoPago = empresa.TipoPago; 
            if ( tipoPago.includes("06")) {
              this_aux.listaEmpresas.push(empresa.Descripcion);
            }
          });
          console.log(this_aux.listaEmpresas);
          this_aux.listaEmpresasAux = this_aux.listaEmpresas;
      } else if (tipoCuenta === 1) {

          this_aux.arrayEmpresas.forEach(empresa => {
           const tipoPago = empresa.TipoPago; 
            if ( tipoPago.includes("04")) {
              this_aux.listaEmpresas.push(empresa.Descripcion);
            }
          });
          console.log(this_aux.listaEmpresas);
          this_aux.listaEmpresasAux = this_aux.listaEmpresas;
      } else {

        this_aux.arrayEmpresas.forEach(empresa => {
          const tipoPago = empresa.TipoPago; 
             this_aux.listaEmpresas.push(empresa.Descripcion);
           
         });
         console.log(this_aux.listaEmpresas);
         this_aux.listaEmpresasAux = this_aux.listaEmpresas;
      }
    }
 }
