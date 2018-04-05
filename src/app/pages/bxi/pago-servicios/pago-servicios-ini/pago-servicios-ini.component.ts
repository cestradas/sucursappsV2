import { SesionBxiService } from './../../sesion-bxi.service';
import { OperacionesBXI } from './../../operacionesBXI';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

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

       this.fillSelectCuentas();
       this.getEmpresas();

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
               const lblSaldoOrigen = document.getElementById('lblSaldoOrigen');
               lblSaldoOrigen.innerHTML = detalleSaldos.SaldoDisponible;
               $('#_modal_please_wait').modal('hide');

             } else {
                this_aux.showErrorSucces(detalleSaldos);
             }
           }, function(error) {
              this_aux.showErrorPromise(error);
       });
     }



getEmpresas() {

       const this_aux = this;
      if (localStorage.getItem('Facturadores') !== null) {

            const facturadores =  localStorage.getItem('Facturadores').toString();
            this_aux.arrayEmpresas = JSON.parse(facturadores);

            this_aux.arrayEmpresas.forEach(empresa => {
              const descripcion = empresa.Descripcion;
              const idEmpresa = empresa.IdFacturador;
              this_aux.listaEmpresas.push(descripcion);
              });
            console.log(this_aux.listaEmpresas);
            this_aux.listaEmpresasAux = this_aux.listaEmpresas;
            $('#_modal_please_wait').modal('hide');
            

      } else {

          const operacionesbxi: OperacionesBXI = new OperacionesBXI();
          operacionesbxi.consultaEmpresas().then(
          function(response) {
                console.log(response.responseJSON);
                const consultaEmpresas = response.responseJSON;
                if (consultaEmpresas.Id === '1') {

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

                  } else {
                    this_aux.showErrorSucces(consultaEmpresas);
                }

              }, function(error) {
                    this_aux.showErrorPromise(error);
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
         this_aux.service.idFacturador = valueFacturador;
         this_aux.getDetalleEmpresa(valueFacturador);
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

               body.off('click');
               this_aux.service.detalleEmpresa_PS = response.responseText;
               this_aux.router.navigate(['/pagoservicios_detail']);

             } else {
                  this_aux.showErrorSucces(detalleEmpresa);
             }
           }, function(error) {
                this_aux.showErrorPromise(error);
           });
     }

     muestraFacturadores() {

       // ESTILO TECLADO (QUITAR ESTILO AL SALIR DE PAGINA PARA EVITAR QUE BAJE MAS EN OTRAS PANTALLAS)
       $( ".cdk-overlay-container" ).css( "margin-top", "19 %" );

       const this_aux = this;
       console.log('muestraFacturadores');
       this_aux.setClickOnBody();
     }

     setValue(value) {
       const aux_this = this;
       aux_this.facturador.nativeElement.value = value ;
       aux_this.showOptions = false;
      }

     setClickOnBody() {
       console.log('click');
       const this_aux = this;
       const body = $('body');

     body.on('click', function() {

      console.log( this_aux.facturador.nativeElement.value);
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
    console.log(error);
    // tslint:disable-next-line:max-line-length
    document.getElementById('mnsError').innerHTML =   "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde."; 
    $('#_modal_please_wait').modal('hide');
    $('#errorModal').modal('show');
  }

  showErrorSucces(json) {
    console.log(json.Id + json.MensajeAUsuario);
    document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario; 
    $('#_modal_please_wait').modal('hide');
    $('#errorModal').modal('show');
  }

 }
