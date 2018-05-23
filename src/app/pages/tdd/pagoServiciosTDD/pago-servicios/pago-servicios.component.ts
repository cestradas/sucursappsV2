import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import $ from 'jquery';
import { ConsultaSaldosTddService, SesionTDDService } from '../../../../services/service.index';
import { consultaCatalogos } from '../../../../services/consultaCatalogos/consultaCatalogos.service';
import { Router } from '@angular/router';
import { SesionBxiService } from '../../../bxi/sesion-bxi.service';


declare var $: $;

@Component({
  selector: 'app-pago-servicios',
  templateUrl: './pago-servicios.component.html'
})
export class PagoServiciosComponent implements OnInit {

  @ViewChild('facturador', { read: ElementRef}) facturador: ElementRef ;

  nombreUsuarioTdd: string;
  saldoClienteTdd: string;
  cuentaClienteTdd: string;

  forma: FormGroup;
  myForm: FormGroup;
  showOptions: Boolean = false;

  arrayEmpresas: Array<any> = [];
  listaEmpresas:  Array<any> = [];
  listaEmpresasAux: Array<any> = [];
  
  
  constructor(  private _service: ConsultaSaldosTddService,
                private _serviceSesion: SesionTDDService,
                private fb: FormBuilder,
                private router: Router,
                private service: SesionBxiService) { 
                 
    const this_aux = this;
    $('#_modal_please_wait').modal('show');

    this.forma = new FormGroup({

      'selectBanco': new FormControl('0', [Validators.required
        // , this.selectDifCero
      ]),
      'numTarjeta': new FormControl('', [Validators.required]),
      'importe': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])

    });
    this._service.cargarSaldosTDD();
    this._service.validarDatosSaldoTdd().then(
      mensaje => {

        console.log('Saldos cargados correctamente TDD');
        this.saldoClienteTdd = mensaje.SaldoDisponible;
        this.cuentaClienteTdd = mensaje.NumeroCuenta;
        this.nombreUsuarioTdd = this._serviceSesion.datosBreadCroms.nombreUsuarioTDD;

      }
    );    
    setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );

    this.myForm = this.fb.group({
      fcFacturador: ['', [Validators.required]],
    });
  }

  ngOnInit() {
     this.getEmpresas();
  }

  
  saveData() {

    const empresaSelect = this.facturador.nativeElement.value;
    this.getIdEmpresa(empresaSelect);
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

       const operaciones: consultaCatalogos = new consultaCatalogos();
       operaciones.consultaEmpresas().then(
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
   const operaciones: consultaCatalogos = new consultaCatalogos();
   operaciones.consultaDetalleEmpresa(idFacturador).then(
       function(response) {
         console.log(response.responseText);
         const detalleEmpresa = response.responseJSON;
         const body = $('body');
         if (detalleEmpresa.Id === '1') {

           body.off('click');
           this_aux.service.detalleEmpresa_PS = response.responseText;
           this_aux.router.navigate(['/pagoServicioDetailTdd']);

         } else {
              this_aux.showErrorSucces(detalleEmpresa);
         }
       }, function(error) {
            this_aux.showErrorPromise(error);
       });
 }

 muestraFacturadores() {

  // ESTILO TECLADO (QUITAR ESTILO AL SALIR DE PAGINA PARA EVITAR QUE BAJE MAS EN OTRAS PANTALLAS)
  // $( ".cdk-overlay-container" ).css( "margin-top", "19 %" );

  const this_aux = this;
  console.log('muestraFacturadores');
  this_aux.setClickOnBody();
}
  setValue(value) {
     
    const aux_this = this;
    const body = $('body');
    body.off('click');
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
  
 showErrorSucces(json) {
  console.log(json.Id + json.MensajeAUsuario);
  document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario; 
  $('#_modal_please_wait').modal('hide');
  $('#errorModal').modal('show');
}

showErrorPromise(error) {
  console.log(error);
  // tslint:disable-next-line:max-line-length
  document.getElementById('mnsError').innerHTML =   "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde."; 
  $('#_modal_please_wait').modal('hide');
  $('#errorModal').modal('show');
}


irMenuTDD() {
  const this_aux = this;
  this_aux.router.navigate(['/menuTdd']);
}



}
