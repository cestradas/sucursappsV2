import { Component, OnInit, Renderer2, ViewChild, ElementRef } from "@angular/core";
import { ValidaNipTransaccion } from '../../../services/validaNipTrans/validaNipTrans.service';
import { ConsultaSaldosTddService } from "../../../services/saldosTDD/consultaSaldos.service";
import { Http, Response, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
import { FormsModule, NgForm, FormGroup, FormControl, Validators, FormArray, FormBuilder} from "@angular/forms";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from "@angular/router";
import { CurrencyPipe } from "@angular/common";
import $ from 'jquery';
import { refCount } from "rxjs/operators";
import { ResponseWS } from '../../../services/response/response.service';

declare var $: any;


@Component({
  selector: "app-transferencia-spei",
  templateUrl: "./transferencia-spei.component.html"
})
export class TransferenciaSpeiComponent implements OnInit {
  @ViewChild("rClabe", { read: ElementRef })
  rClabe: ElementRef;
  @ViewChild("rBeneficiario", { read: ElementRef })
  rBeneficiario: ElementRef;
  @ViewChild("rDescripcion", { read: ElementRef })
  rDescripcion: ElementRef;
  @ViewChild("rImporte", { read: ElementRef })
  rImporte: ElementRef;
  @ViewChild("rReferencia", { read: ElementRef })
  rReferencia: ElementRef;
  @ViewChild("rEmail", { read: ElementRef })
  rEmail: ElementRef;

  numeroCuentaTitular: string;
  saldoDisponibleClienteTdd: string;
  idCuentaTitular: string;
  nombreSele: any = "";
  clabe: any = "";
  nombreBanco: any = "";
  bancoRecep: any = "";
  nombreBene: any = "";
  referencia: any = "";
  importe: any = "";
  descripcion: any = "";
  email: any = "";

  myform: FormGroup;

  listaBancos: any;
  nombreOperacion: any;

  constructor(
    public fb: FormBuilder,
    private _service: ConsultaSaldosTddService,
    private _validaNipService: ValidaNipTransaccion,
    private router: Router,
    private serviceTransferenciaSpei: ResponseWS
  ) {
    this._service.cargarSaldosTDD();

    $("#_modal_please_wait").modal("show");
    this._service.validarDatosSaldoTdd().then(mensaje => {
      console.log("Saldos cargados correctamente TDD");
      this.saldoDisponibleClienteTdd = mensaje.SaldoDisponible;
      this.numeroCuentaTitular = mensaje.NumeroCuenta;
      this.idCuentaTitular = mensaje.Id;
      setTimeout(() => $("#_modal_please_wait").modal("hide"), 1000);
    });

    setTimeout(() => $("#_modal_please_wait").modal("hide"), 3000);

    this.myform = this.fb.group({
      numeroClabeF: [""],
      nombreBeneficiarioF: [""],
      descripcionF: [""],
      importeF: [""],
      referenciaF: [""],
      correoF: [""]
    });
  }

  ngOnInit() {
    $(".cdk-visually-hidden").css("margin-top", "5%");
  }

  consultaBancosNacionalesService() {
    const this_aux = this;
    this_aux.listaBancos = null;
    $("#_modal_please_wait").modal("show");
    const resourceRequest = new WLResourceRequest(
      "adapters/AdapterBanorteSucursApps/resource/consultaBancosNacionales",
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.send().then(
      function(response) {
        this_aux.listaBancos = response.responseJSON;
        this_aux.listaBancos.sort(this_aux.sortByProperty('NombreBanco'));
        $("#_modal_please_wait").modal("hide");
      },
      function(error) {
        console.error("El WS respondio incorrectamente");
        $("#_modal_please_wait").modal("hide");
        $("#errorModal").modal("show");
      }
    );
  }

  consultaTablaCorpBancosService() {
    const this_aux = this;
    this_aux.listaBancos = null;
    $("#_modal_please_wait").modal("show");
    const resourceRequest = new WLResourceRequest(
      "adapters/AdapterBanorteSucursApps/resource/consultaTablaCorporativaBancos",
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.send().then(
      function(response) {
        this_aux.listaBancos = response.responseJSON;
        this_aux.listaBancos.sort(this_aux.sortByProperty('NombreBanco'));
        $("#_modal_please_wait").modal("hide");
      },
      function(error) {
        console.error("El WS respondio incorrectamente");
        $("#_modal_please_wait").modal("hide");
        $("#errorModal").modal("show");
      }
    );
  }

  sortByProperty = function (property) {

    return function (x, y) {

        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));

    };

};

  seleccionOperacion(operacion) {
    const this_aux = this;
    this_aux.nombreOperacion = operacion;

    const controlNombrenBenef: FormControl = new FormControl(
      this_aux.rBeneficiario.nativeElement.value,
      Validators.required
    );
    this_aux.myform.setControl("nombreBeneficiarioF", controlNombrenBenef);
    const controlDescripcion: FormControl = new FormControl(
      this_aux.rDescripcion.nativeElement.value,
      Validators.required
    );
    this_aux.myform.setControl("descripcionF", controlDescripcion);
    const controlImporte: FormControl = new FormControl(
      this_aux.rImporte.nativeElement.value,
      Validators.required
    );
    this_aux.myform.setControl("importeF", controlImporte);
    const controlReferencia: FormControl = new FormControl(
      this_aux.rReferencia.nativeElement.value,
      [Validators.maxLength(7)]
    );
    this_aux.myform.setControl("referenciaF", controlReferencia);
    const controlCorreo: FormControl = new FormControl(
      this_aux.rEmail.nativeElement.value,
      Validators.required
    );
    this_aux.myform.setControl("correoF", controlCorreo);
    if (operacion === "1") {
      this_aux.consultaTablaCorpBancosService();
      console.log("Seleccionaste QUICK");
      const controlClabe: FormControl = new FormControl(
        this_aux.rClabe.nativeElement.value,
        [
          Validators.required,
          Validators.minLength(18),
          Validators.maxLength(18)
        ]
      );
      this_aux.myform.setControl("numeroClabeF", controlClabe);
    }

    if (operacion === "2") {
      this_aux.consultaBancosNacionalesService();
      console.log("Seleccionaste TEF");
      const controlClabe: FormControl = new FormControl(
        this_aux.rClabe.nativeElement.value,
        [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16)
        ]
      );
      this_aux.myform.setControl("numeroClabeF", controlClabe);
    }
  }

  selectBanco(bancoSeleccionado) {
    const this_aux = this;

    this_aux.bancoRecep = bancoSeleccionado;

    this_aux.nombreSele = document.getElementById("selecBanco");
    this_aux.nombreBanco =
      this_aux.nombreSele.options[this_aux.nombreSele.selectedIndex].text;
  }

  showDetallePago(
    clabeBenRec,
    nombreBeneRec,
    refRec,
    importeRec,
    descripcionRec,
    correoRec
  ) {
    const this_aux = this;

    this_aux.clabe = clabeBenRec;
    this_aux.importe = importeRec;
    this_aux.email = correoRec;
    this_aux.nombreBene = nombreBeneRec;
    this_aux.descripcion = descripcionRec;
    this_aux.referencia = refRec;
    $("#confirmModal").modal("show");
  }

  cerrarModalConfirmModal() {
    $("#confirmModal").modal("toggle");
  }

  transferenciaSPEISoap(
    clabeBenRec,
    nombreBeneRec,
    refRec,
    importeRec,
    descripcionRec,
    correoRec
  ): any {
    const this_aux = this;
    console.log("Inicia Transacccion Spei");

    let formParameters = {
      idCuenta: this_aux.idCuentaTitular,
      numeroCuenta: this_aux.numeroCuentaTitular,
      importe: importeRec,
      correo: correoRec,
      descripcion: descripcionRec.toUpperCase(),
      // bancoRecep: "40014",
      bancoRecep: this_aux.bancoRecep.trim(),
      clabeBeneficiario: clabeBenRec,
      nombreBene: nombreBeneRec.toUpperCase(),
      referencia: refRec
    };

    let respuestaSpei;

    const resourceRequest = new WLResourceRequest(
      "adapters/AdapterBanorteSucursApps/resource/transferInterSPEI",
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        respuestaSpei = response.responseJSON;
        if (respuestaSpei.Id === "1") {
          const stringDatosSpei = JSON.stringify(respuestaSpei);
          this_aux.serviceTransferenciaSpei.datosTransferenciaSPEI = stringDatosSpei;
          this_aux.serviceTransferenciaSpei.nombreOperacion = "SPEI";
          $("#_modal_please_wait").modal("show");
          this_aux.router.navigate(["/detalleTransferenciaSpei"]);
        } else {
          $("#ModalErrorTransaccion").modal("show");
        }
      },
      function(error) {
        $("#errorModal").modal("show");
        $("#_modal_please_wait").modal("hide");
        console.log("Error al realizar Transacccion");
      }
    );
  }

  transferenciaTEFSoap(
    clabeBenRec,
    nombreBeneRec,
    refRec,
    importeRec,
    descripcionRec,
    correoRec
  ): any {
    const this_aux = this;
    console.log("Inicia Transacccion TEF");

    let formParameters = {
      numeroCuenta: this_aux.numeroCuentaTitular,
      bancoRecep: this_aux.bancoRecep.trim(),
      clabeBeneficiario: clabeBenRec,
      nombreBene: nombreBeneRec.toUpperCase(),
      correo: correoRec,
      importe: importeRec,
      referencia: refRec,
      concepto: descripcionRec.toUpperCase()
    };

    let respuestaTef;

    const resourceRequest = new WLResourceRequest(
      "adapters/AdapterBanorteSucursApps/resource/transferInterTEF",
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        respuestaTef = response.responseJSON;
        if (respuestaTef.Id === "1") {
          const stringDatosTef = JSON.stringify(respuestaTef);
          this_aux.serviceTransferenciaSpei.datosTransferenciaSPEI = stringDatosTef;
          this_aux.serviceTransferenciaSpei.nombreOperacion = "TEF";
          $("#_modal_please_wait").modal("show");
          this_aux.router.navigate(["/detalleTransferenciaSpei"]);
        } else {
          $("#ModalErrorTransaccion").modal("show");
          $("#_modal_please_wait").modal("hide");
        }
      },
      function(error) {
        $("#errorModal").modal("show");
        $("#_modal_please_wait").modal("hide");
        console.log("Error al realizar Transacccion");
      }
    );
  }

  validarSaldoDiaSoap(): any {
    const this_aux = this;
    console.log("Inicia validacion de saldo dia");

    let formParameters = {
      numeroCuenta: this_aux.numeroCuentaTitular,
      importe: this_aux.importe
    };

    let respuestaTef;

    const resourceRequest = new WLResourceRequest(
      "adapters/AdapterBanorteSucursApps/resource/validaSaldoDia",
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        console.log("VALIDACION DE SALDO AL DIA: " + response.responseJSON);
      },
      function(error) {
        console.log("Error al realizar validacion de saldo dia");
      }
    );
  }

  validarSaldoMensualSoap(): any {
    const this_aux = this;
    console.log("Inicia validacion de saldo mensual");

    let formParameters = {
      numeroCuenta: this_aux.numeroCuentaTitular,
      importe: this_aux.importe
    };

    let respuestaTef;

    const resourceRequest = new WLResourceRequest(
      "adapters/AdapterBanorteSucursApps/resource/validaSaldoMes",
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        console.log("VALIDACION DE SALDO AL MES: " + response.responseJSON);
      },
      function(error) {
        console.log("Error al realizar validacion de saldo mensual");
      }
    );
  }

  confirmarTransaccion() {
    this._validaNipService.validaNipTrans();
    const this_aux = this;

    $("#ModalTDDLogin").modal("show");

    let res;

    this._validaNipService.validarDatosrespuesta().then(mensaje => {
      res = this._validaNipService.respuestaNip.res;
      console.log(res);

      if (res === true) {
        $("#ModalTDDLogin").modal("hide");
        $("#_modal_please_wait").modal("show");
        this_aux.validarSaldoMensualSoap();
        this_aux.validarSaldoDiaSoap();

        if (this_aux.nombreOperacion === "1") {
          this_aux.transferenciaSPEISoap(
            this_aux.clabe,
            this_aux.nombreBene,
            this_aux.referencia,
            this_aux.importe,
            this_aux.descripcion,
            this_aux.email
          );
        } else if (this_aux.nombreOperacion === "2") {
          this_aux.transferenciaTEFSoap(
            this_aux.clabe,
            this_aux.nombreBene,
            this_aux.referencia,
            this_aux.importe,
            this_aux.descripcion,
            this_aux.email
          );
        }
      } else {
        console.error("Mostrar modal las tarjetas no son iguales");
      }
    });
  }
}
