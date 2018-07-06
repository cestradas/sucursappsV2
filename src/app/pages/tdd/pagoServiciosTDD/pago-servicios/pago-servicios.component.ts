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
  empresaSelect: Boolean = false ;
  nombreEmpresaSelect: string;


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
    const operaciones: consultaCatalogos = new consultaCatalogos();
    this._service.cargarSaldosTDD();
    this._service.validarDatosSaldoTdd().then(
      mensaje => {

        console.log('Saldos cargados correctamente TDD');
        this.saldoClienteTdd = mensaje.SaldoDisponible;
        this.cuentaClienteTdd = operaciones.mascaraNumeroCuenta(mensaje.NumeroCuenta);
        this.nombreUsuarioTdd = this._serviceSesion.datosBreadCroms.nombreUsuarioTDD;

      }
    );
    setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );
    

    this.myForm = this.fb.group({
      fcFacturador: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    
    // ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnContinuar = document.getElementById("continuar");

    if (storageTipoClienteTar === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }

     this.getEmpresas();
     $( ".cdk-visually-hidden" ).css( "margin-top", "30%" );
  }


  saveData() {

    const empresaSelect = this.facturador.nativeElement.value;
    this.getIdEmpresa(empresaSelect);
  }

  getEmpresas() {

    const this_aux = this;
   if (localStorage.getItem('Facturadores') !== null) {
    
    setTimeout(function() {
         const facturadores =  localStorage.getItem('Facturadores').toString();
         this_aux.arrayEmpresas = JSON.parse(facturadores);

         this_aux.arrayEmpresas.forEach(empresa => {
           const descripcion = empresa.Descripcion;
           const idEmpresa = empresa.IdFacturador;
           this_aux.listaEmpresas.push(descripcion);
           });
         console.log(this_aux.listaEmpresas);
         this_aux.listaEmpresasAux = this_aux.listaEmpresas;
         setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
        }, 500);

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
               setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);

               } else {
                 this_aux.showErrorSucces(consultaEmpresas);
             }
                 this_aux.actualizaEmpresasXtipoPago();
           }, function(error) {
            setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
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
            setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
       }, function(error) {
            setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
            this_aux.showErrorPromise(error);
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

   console.log( this_aux.facturador.nativeElement.value);
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

 showErrorSucces(error) {
  $('#errorModal').modal('show');
      if (error.errorCode === 'API_INVOCATION_FAILURE') {
          document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
      } else {
        document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
      }
}

showErrorPromise(error) {
  console.log(error);
  // tslint:disable-next-line:max-line-length
  document.getElementById('mnsError').innerHTML =   "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
  setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
  $('#errorModal').modal('show');
}


irMenuTDD() {
  const this_aux = this;
  this_aux.router.navigate(['/menuTdd']);
}

actualizaEmpresasXtipoPago() {
  const this_aux = this;

  this_aux.listaEmpresas = [];
  const facturadores =  localStorage.getItem('Facturadores').toString();
  this_aux.arrayEmpresas = JSON.parse(facturadores);

      this_aux.arrayEmpresas.forEach(empresa => {
       const tipoPago = empresa.TipoPago; 
        if ( tipoPago.includes("04")) {
          this_aux.listaEmpresas.push(empresa.Descripcion);
        }
      });
      console.log(this_aux.listaEmpresas);
      this_aux.listaEmpresasAux = this_aux.listaEmpresas;
  
  }

}
