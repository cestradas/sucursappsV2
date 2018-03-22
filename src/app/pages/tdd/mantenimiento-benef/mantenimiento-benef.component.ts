import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { variable } from '@angular/compiler/src/output/output_ast';
import { Response } from '@angular/http';

declare var $: any;
declare var angular: any;

@Component({
  selector: 'app-mantenimiento-benef',
  templateUrl: './mantenimiento-benef.component.html',
  styleUrls: ['./mantenimiento-benef.component.css']
})
export class MantenimientoBenefComponent implements OnInit {
  DatosJSON: any;
  BEN: any;
  NumeroDatoInicial: any = 0;
  NumeroDatoFinal: any = 8;
  consecutivoSeleccionado: any = '';

myForm1:  FormGroup;
  constructor(
  public fb: FormBuilder) {
    this.myForm1 = this.fb.group({
      nombres: ['', [Validators.required]],     
    });
   }

  ngOnInit() {
   this.consultaBeneficiarios();
  }


  altaBeneficiario() {
    $('#altaBenefModal').modal('show');
  }  

  modificaBeneficiario() {
    $('#ModificacionBenefModal').modal('show');
  }  

  bajaBeneficiarioModal(datosBeneficiario) {
    console.log(datosBeneficiario);
    console.log(datosBeneficiario.NumeroConsecutiv);
    this.consecutivoSeleccionado = datosBeneficiario.NumeroConsecutiv;
    $('#modalBajaBeneficiarios').modal('show');

  }

  saveData() {
    alert(JSON.stringify(this.myForm1.value));
  }


  consultaBeneficiarios() {
    const this_aux = this;
    console.log("adentro consultarBeneficiarios");

    let numCuenta = "0665815045";
 
      const THIS: any = this;

  const formParameters = {
    numeroCuenta:  numCuenta
  };

  const resourceRequest = new WLResourceRequest(
    'adapters/AdapterBanorteSucursApps/resource/consultaMantenimientoBeneficiarios',
    WLResourceRequest.POST);
resourceRequest.setTimeout(30000);
resourceRequest
    .sendFormParameters(formParameters)
    .then(
        function(response) {
          console.log(response.responseJSON);
          this_aux.DatosJSON = response.responseJSON;
          this_aux.BEN = this_aux.DatosJSON.ArrayBeneficiarios;
        },
        function(error) {
          THIS.loading = false;
          console.log("Error al consultar Beneficiarios");          
        });
        console.log("Salió de Response");
  }

  bajaBeneficiarios() {
    const this_aux = this;
    console.log("adentro BajaBeneficiarios");

    let numCuenta = "0665815045";
    let numConsec = this.consecutivoSeleccionado;
 
      const THIS: any = this;

  const formParameters = {
    numeroCuenta:  numCuenta,
    numeroConsecutivo: numConsec
  };

  const resourceRequest = new WLResourceRequest(
    'adapters/AdapterBanorteSucursApps/resource/bajaMantenimientoBeneficiarios',
    WLResourceRequest.POST);
resourceRequest.setTimeout(30000);
resourceRequest
    .sendFormParameters(formParameters)
    .then(
        function() {
        
        },
        function(error) {
          THIS.loading = false;
          console.log("holaError");          
        });
        console.log("Salió de Response");

  this.consultaBeneficiarios();
  }

  pruebasMetodo() {
    console.log(this.consecutivoSeleccionado);
  }
         
}
