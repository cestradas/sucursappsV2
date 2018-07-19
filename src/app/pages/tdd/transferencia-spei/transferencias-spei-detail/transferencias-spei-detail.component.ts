import { Component, OnInit } from "@angular/core";
import { ResponseWS } from "../../../../services/response/response.service";
import { ConsultaSaldosTddService } from "../../../../services/saldosTDD/consultaSaldos.service";
import { SesionTDDService } from "../../../../services/breadcrums/breadcroms.service";

declare var $: any;

@Component({
  selector: "app-transferencias-spei-detail",
  templateUrl: "./transferencias-spei-detail.component.html"
})
export class TransferenciasSpeiDetailComponent implements OnInit {
  formatoFecha: any;
  tipoOperacion: String;
  operacionType: any;

  detalleTransferencia: any = {
    cuentaTitular: "",
    nombreTitular: "",
    fechaOperacion: "",
    horaOperacion: "",
    clabeOrdenante: "",
    claveRastreo: "",
    comision: "",
    cuentaBeneficiario: "",
    descripcionCuentaBen: "",
    importeIva: "",
    nombreBeneficiario: "",
    nombreOrdenante: "",
    numeroReferencia: "",
    referenciaNumerica: "",
    totalCargo: "",
    rFcOrdenante: "",
    nombreBanco: "",
    concepto: "",

    importe: "",
    totales: ""
  };

  constructor(
    private serviceMantenimiento: ResponseWS,
    private _service: ConsultaSaldosTddService,
    private _serviceSesion: SesionTDDService
  ) {
    const this_aux = this;

    this_aux.tipoOperacion = serviceMantenimiento.nombreOperacion;
    this_aux.operacionType = this_aux.tipoOperacion;
    const objSpeiTrans = serviceMantenimiento.datosTransferenciaSPEI;
    const jsonSpeiTrans = JSON.parse(objSpeiTrans);

    this._service.validarDatosSaldoTdd().then(mensaje => {
      console.log("Saldos cargados correctamente TDD");
      this.detalleTransferencia.cuentaTitular = mensaje.NumeroCuenta;
    });

    if (this_aux.tipoOperacion === "SPEI") {
      this_aux.detalleTransferencia.nombreTitular = this._serviceSesion.datosBreadCroms.nombreUsuarioTDD;
      this_aux.detalleTransferencia.claveRastreo =
        jsonSpeiTrans.ClaveRastreoSpei;
      this_aux.detalleTransferencia.comision = jsonSpeiTrans.Comision;
      this_aux.detalleTransferencia.cuentaBeneficiario =
        jsonSpeiTrans.CuentaClabeBeneficia;
      this_aux.detalleTransferencia.descripcionCuentaBen =
        jsonSpeiTrans.DescCuentaBeneficia;
      this_aux.detalleTransferencia.fechaOperacion =
        jsonSpeiTrans.FechaOperacion;
      this_aux.detalleTransferencia.horaOperacion = jsonSpeiTrans.HoraOperacion;
      this_aux.detalleTransferencia.importeIva = jsonSpeiTrans.ImporteIva;
      this_aux.detalleTransferencia.nombreBeneficiario =
        jsonSpeiTrans.NombreBeneficiario;
      this_aux.detalleTransferencia.nombreOrdenante =
        jsonSpeiTrans.NombreOrdenante;
      this_aux.detalleTransferencia.numeroReferencia =
        jsonSpeiTrans.NumReferencia;
      this_aux.detalleTransferencia.referenciaNumerica =
        jsonSpeiTrans.ReferenciaNumerica;
      this_aux.detalleTransferencia.totalCargo = jsonSpeiTrans.TotalCargo;
      this_aux.detalleTransferencia.clabeOrdenante =
        jsonSpeiTrans.ClabeOrdenante;
      this_aux.detalleTransferencia.rFcOrdenante =
        jsonSpeiTrans.RfcCurpOrdenante;
      this_aux.detalleTransferencia.nombreBanco =
        jsonSpeiTrans.DescBancoReceptor;
      this_aux.detalleTransferencia.concepto = jsonSpeiTrans.Concepto;
    } else if (this_aux.tipoOperacion === "TEF") {
      this_aux.detalleTransferencia.nombreTitular = this._serviceSesion.datosBreadCroms.nombreUsuarioTDD;
      this_aux.detalleTransferencia.importe = jsonSpeiTrans.CampoImporte;
      this_aux.detalleTransferencia.comision = jsonSpeiTrans.CampoComision;
      this_aux.detalleTransferencia.importeIva = jsonSpeiTrans.CampoImporteIva;
      this_aux.detalleTransferencia.totales = jsonSpeiTrans.CampoTotales;
      this_aux.detalleTransferencia.referenciaNumerica =
        jsonSpeiTrans.CampReferencia;
      this_aux.detalleTransferencia.numeroReferencia =
        jsonSpeiTrans.NumReferencia;        
    }

    this_aux.formatoFecha = new Date(
      this_aux.detalleTransferencia.fechaOperacion
    );
  }

  ngOnInit() {

    const this_aux = this;
    //ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnContinuar = document.getElementById("terminar");

    if (storageTipoClienteTar === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }
    $("#_modal_please_wait").modal("hide");
  }
}
