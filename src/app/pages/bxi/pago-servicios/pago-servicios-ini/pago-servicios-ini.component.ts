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
 
   constructor(  private router: Router, public service: SesionBxiService, private renderer: Renderer2) {
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
 
 
 
     getEmpresas() {
 
       const this_aux = this;
       const operacionesbxi: OperacionesBXI = new OperacionesBXI();
       operacionesbxi.consultaEmpresas().then(
           function(response) {
             console.log(response.responseJSON);
             const consultaEmpresas = response.responseJSON;
 
            if (consultaEmpresas.Id === '1') {
               this_aux.arrayEmpresas = consultaEmpresas.Facturadores;
               this_aux.arrayEmpresas.forEach(empresa => {
 
                 const descripcion = empresa.Descripcion;
                 const idEmpresa = empresa.IdFacturador;
                 this_aux.listaEmpresas.push(descripcion);
               });
               console.log(this_aux.listaEmpresas);
               this_aux.listaEmpresasAux = this_aux.listaEmpresas;
               this_aux.setClickOnBody();
 
            } else {
             console.log(consultaEmpresas.MensajeAUsuario);
            }
 
           }, function(error) {
 
           });
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
               this_aux.router.navigate(['/pagoservicios_bxi_detail']);
 
             } else {
               console.log(detalleEmpresa.MensajeAUsuario);
             }
           }, function(error) {
 
           });
     }
 
     muestraFacturadores() {
       const aux_this = this;
       aux_this.showOptions = true;
     }
 
     setValue(value) {
       const aux_this = this;
       aux_this.showOptions = false;
       aux_this.facturador.nativeElement.value = value ;
     }
 
     setClickOnBody() {
       const this_aux = this;
       const body = $('body');
       console.log($('body'));
 
     body.on('click', function() {
         console.log( this_aux.facturador.nativeElement.value);
         const auxOption = [];
         const valueInput = this_aux.facturador.nativeElement.value;
         if (valueInput.toUpperCase() === '') {
           this_aux.listaEmpresas = this_aux.listaEmpresasAux;
         } else {
 
           this_aux.listaEmpresas.forEach(element => {
             if (element.includes(valueInput.toUpperCase())) {
               auxOption.push(element);
             }
 
         });
         //  validar que aux option no sea 0
           this_aux.listaEmpresas = auxOption;
       }
     });
   }
 
 }
