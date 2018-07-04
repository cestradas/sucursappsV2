import { Component, OnInit } from '@angular/core';
import { ResponseWS } from '../../../../services/response/response.service';
import { ConsultaSaldosTddService } from '../../../../services/saldosTDD/consultaSaldos.service';
declare var $: any;

@Component({
  selector: 'app-mantenimiento-benef-detail',
  templateUrl: './mantenimiento-benef-detail.component.html'
})
export class MantenimientoBenefDetailComponent implements OnInit {

  BEN: any;
  numeroCuentaTitular: string;

  detalleBeneficiarios: any = {
    fechaOperacion: '',
    horaOperacion: '' 
};

  constructor(private _service: ConsultaSaldosTddService) { 
    $('#_modal_please_wait').modal('show');
    this._service.validarDatosSaldoTdd().then(
      mensaje => {

        console.log('Saldos cargados correctamente TDD');
        this.numeroCuentaTitular = mensaje.NumeroCuenta;
        this.consultaBeneficiarios();
      }
    ); 
  }

  


  ngOnInit() {

    //ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnContinuar = document.getElementById("terminar");

    if (storageTipoClienteTar === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }

    const this_aux = this;
    this_aux.consultaBeneficiarios();
  }

  
  consultaBeneficiarios() {
    const this_aux = this;
    const THIS: any = this;
    console.log("adentro consultarBeneficiarios");
    console.log(this_aux.BEN);
    let anio: any = "";
    let mes: any = "";
    let dia: any = "";
    const formParameters = {
      numeroCuenta: this_aux.numeroCuentaTitular
    };

    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps2/resource/consultaMantenimientoBeneficiarios',
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        console.log(response.responseJSON);
        const DatosJSON = response.responseJSON;
        this_aux.BEN = DatosJSON.ArrayBeneficiarios;
        if (this_aux.BEN === undefined) {
          $('#errorModal').modal('show');
        } else {
          const jsonMantenimiento = DatosJSON;
        this_aux.detalleBeneficiarios.fechaOperacion = jsonMantenimiento.FechaOperacion;
        this_aux.detalleBeneficiarios.horaOperacion = jsonMantenimiento.HoraOperacion;
          this_aux.BEN.forEach(function(value, key) {
            if (value.FechaNacimiento !== "00010101" && value.FechaNacimiento !== "19000101") {
              let mostrarFechaFormat = value.FechaNacimiento;
              anio = mostrarFechaFormat.substring(0, 4);
              mes = mostrarFechaFormat.substring(4, 6);
              dia = mostrarFechaFormat.substring(6, 8);
              mostrarFechaFormat = anio + "-" + mes + "-" + dia;
              value.NuevaFecha = mostrarFechaFormat;
            } else {
              value.NuevaFecha = "";
            }                   
          });                  
        }  
        $('#_modal_please_wait').modal('hide');    
      },
      function(error) {        
        console.log("Error al consultar beneficiarios");
        $('#_modal_please_wait').modal('hide');
      }
    );
    console.log("Salió de Response Consultar Beneficiarios");
  }


}
