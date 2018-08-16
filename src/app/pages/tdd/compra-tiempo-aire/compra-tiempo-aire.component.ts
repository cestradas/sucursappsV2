import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { ConsultaSaldosTddService } from '../../../services/saldosTDD/consultaSaldos.service';
import { SesionTDDService } from '../../../services/breadcrums/breadcroms.service';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ResponseWS } from '../../../services/response/response.service';
import { ValidaNipTransaccion } from '../../../services/validaNipTrans/validaNipTrans.service';
import { SaldosDiaMesService } from '../../../services/SaldosDiaMes/saldoDiaMes.service';
import { consultaCatalogos } from '../../../services/consultaCatalogos/consultaCatalogos.service';
import { validateConfig } from "@angular/router/src/config";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import $ from 'jquery';
declare var $: $;

@Component({
  selector: "app-compra-tiempo-aire",
  templateUrl: "./compra-tiempo-aire.component.html"
})
export class CompraTiempoAireComponent implements OnInit {
  @ViewChild("telefonoF", { read: ElementRef })
  telefonoF: ElementRef;

  subscription: Subscription;

  nombreUsuarioTdd: string;
  saldoClienteTdd: string;
  cuentaClienteTdd: string;
  tipoCuentaTdd: string;
  cveTelefonicaF = "";
  forma: FormGroup;
  mostrarCuentaMascara: string;
  recargas: any[] = [];
  operador: string;
  importe: number;
  blClassT = false;
  blClassM = false;
  blClassU = false;
  blClassI = false;
  blnStyle: false;

  respuestaTrjeta = "";
  validacionNip = "";

  constructor(
    private _service: ConsultaSaldosTddService,
    private _serviceSesion: SesionTDDService,
    private _saldosDiaMes: SaldosDiaMesService,
    private _validaNipService: ValidaNipTransaccion,
    private serviceResponse: ResponseWS,
    private router: Router
  ) {
    this._service.cargarSaldosTDD();

    $("#_modal_please_wait").modal("show");

    this._service.validarDatosSaldoTdd().then(mensaje => {
      const operaciones: consultaCatalogos = new consultaCatalogos();
      console.log("Saldos cargados correctamente TDD");
      this.saldoClienteTdd = mensaje.SaldoDisponible;
      this.cuentaClienteTdd = mensaje.NumeroCuenta;
      this.nombreUsuarioTdd = this._serviceSesion.datosBreadCroms.nombreUsuarioTDD;
      this.mostrarCuentaMascara = operaciones.mascaraNumeroCuenta(
        mensaje.NumeroCuenta
      );
      this.tipoCuentaTdd = mensaje.Producto;
      this.consultarEmpresasTelefonos();
    });

    this.forma = new FormGroup({
      telefono: new FormControl("", [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern(/^([0-9]{1,})$/)
      ]),
      // 'email': new FormControl('', [Validators.required,
      //  Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      operador: new FormControl(),
      importe: new FormControl()
    });
  }

  ngOnInit() {
    localStorage.removeItem("des");
    localStorage.removeItem("np");
    localStorage.removeItem("res");
    localStorage.removeItem("tr2");
    localStorage.removeItem("tr2_serv");
    localStorage.removeItem("np_serv");
    localStorage.removeItem("res_serv");

    //ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnContinuar = document.getElementById("continuar");

    if (storageTipoClienteTar === "true") {
      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }
    $(".cdk-visually-hidden").css("margin-top", "15%");
  }

  consultarEmpresasTelefonos() {
    const THIS: any = this;
    $("#_modal_please_wait").modal("show");
    const resourceRequest = new WLResourceRequest(
      "adapters/AdapterBanorteSucursApps2/resource/consultaCatalogoEmpresaTel",
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.send().then(
      function(response) {
        let res = response.responseJSON;

        // tslint:disable-next-line:forin
        for (let i in res) {
          console.log(res[i].Nombre);

          switch (res[i].Nombre) {
            case "Telcel": {
              document.getElementById("imagenTelcel").id = res[i].IdCatEmpresa;

              break;
            }
            case "Movistar": {
              document.getElementById("importeMovi").id = res[i].IdCatEmpresa;

              break;
            }
            case "Unefon": {
              document.getElementById("importeUnefon").id = res[i].IdCatEmpresa;

              break;
            }
            case "Iusacell": {
              document.getElementById("importeIusa").id = res[i].IdCatEmpresa;

              break;
            }
            default: {
              console.log(
                "No se pudo cargar la informacion de los catalogos telefonicos"
              );
              break;
            }
          }
        }
        $("#_modal_please_wait").modal("hide");
/*
        setTimeout(() => {
          $("#_modal_please_wait").modal("hide");
        }, 4000); */
      },
      function(error) {
        console.error("El WS respondio incorrectamente1");
        // document.getElementById('mnsError').innerHTML = "El Ws no respondio";
        $("#_modal_please_wait").modal("hide");
        $("#errorModal").modal("show");
      }
    );
  }

  cargaSaldo(id) {
    $("#_modal_please_wait").modal("show");

    const THIS: any = this;
    const this_aux = this;

    console.log(id.id);

    this_aux.cveTelefonicaF = id.id;
    switch (id.name) {
      case "importeTelcel": {
        this.operador = "Telcel";
        this.blClassT = true;
        this.blClassM = false;
        this.blClassU = false;
        this.blClassI = false;
        console.log("Telcel");
        break;
      }
      case "importeMovi": {
        this.operador = "Movistar";
        this.blClassM = true;
        this.blClassT = false;
        this.blClassU = false;
        this.blClassI = false;
        break;
      }
      case "importeUnefon": {
        this.operador = "Unefon";
        this.blClassT = false;
        this.blClassM = false;
        this.blClassU = true;
        this.blClassI = false;
        break;
      }
      case "importeIusa": {
        this.operador = "Iusacell";
        this.blClassT = false;
        this.blClassM = false;
        this.blClassU = false;
        this.blClassI = true;
        break;
      }
      default: {
        console.log("No existe ese operador: " + id.id);
        break;
      }
    }

    console.log("Params img telefonos: " + id.name + " Id: " + id.id);

    const formParameters = {
      paramIdCatEmpresa: id.id
    };

    const resourceRequest = new WLResourceRequest(
      "adapters/AdapterBanorteSucursApps2/resource/consultaImporteTiempoAire",
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        let res = response.responseJSON;

        if ((res.Id = "1")) {
          console.log(response.responseText);
          THIS.recargas = res;
        } else {
          this_aux.showErrorSucces(res);
        }
        setTimeout(() => {          
        $("#_modal_please_wait").modal("hide");
        }, 3000);
      },
      function(error) {
        $("#_modal_please_wait").modal("hide");
        console.error("El WS respondio incorrectamente2");
        this_aux.showErrorPromise(error);
      }
    );
  }

  cargaImporte(param) {
    $("label").removeClass("border border-danger");
    $("#" + param.id).addClass("border border-danger");
    this.importe = param.id;
    $("#telefono").prop("disabled", false);
  }

  recargaTiempoAire() {
    const this_aux = this;
    let importeDecimal = parseFloat(this_aux.importe.toString()).toFixed(2);
    let numeroTarjeta = localStorage.getItem("tr2_serv").substring(0, 16);
    this_aux.serviceResponse.operadorTelefono = this_aux.operador;
    let formParameters = {
      ctaO: numeroTarjeta,
      cveTelefonica: this_aux.cveTelefonicaF,
      numTel: this_aux.telefonoF.nativeElement.value,
      importeTel: importeDecimal
    };
    const resourceRequest = new WLResourceRequest(
      "adapters/AdapterBanorteSucursApps2/resource/compraTiempoAire",
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        console.log(response.responseJSON);

        const compraTAResp = response.responseJSON;

        if (compraTAResp.Id === "1") {
          console.log(compraTAResp);
          this_aux.serviceResponse.detalleConfirmacionCTA =
            response.responseText;
          console.log(this_aux.serviceResponse.detalleConfirmacionCTA);
          this_aux.router.navigate(["/compraTiempoAireFinal"]);
        } else {
          this_aux.showErrorSucces(compraTAResp);
        }        
      },
      function(error) {
        console.error("El WS respondio incorrectamente");
        this_aux.showErrorPromiseMoney(error);
      }
    );
  }

  trnasrecargaTA() {    
    document.getElementById("capturaInicio").style.display = "none";
    document.getElementById("caputuraSesion").style.display = "block";
    $("#_modal_please_wait").modal("show");
    this._validaNipService.validaNipTrans();

    let res;

    this._validaNipService.validarDatosrespuesta().then(mensaje => {
      res = this._validaNipService.respuestaNip.res;
      console.log(res);

      if (res === true) {
        $("#ModalTDDLogin").modal("hide");
        $("#_modal_please_wait").modal("show");
        this._validaNipService.respuestaNip.res = "";
        this.recargaTiempoAire();        
      } else {
        console.error("Mostrar modal el nip no es igual");
        document.getElementById("mnsError").innerHTML =
          "Los datos proporcionados son incorrectos, favor de verificar.";
        $("#_modal_please_wait").modal("hide");
        $("#errorModal").modal("show");
        $("#ModalTDDLogin").modal("hide");
        this._validaNipService.respuestaNip.res = "";
      }
    });
  }

  confirmarModal() {
    $("#confirmModal").modal("show");
  }

  validarSaldo() {
    const this_aux = this;
    $("#_modal_please_wait").modal("show");
    let importeDecimal = parseFloat(this_aux.importe.toString()).toFixed(2);
    this._validaNipService.consultaTablaYValidaSaldo(importeDecimal).then(
      function(response) {
        let DatosJSON = response.responseJSON;
        if (DatosJSON.Id === "1") {
          this_aux.confirmarModal();
        } else if (DatosJSON.Id === "4") {
          $("#modalLimiteDiario").modal("show");
        } else if (DatosJSON.Id === "5") {
          $("#modalLimiteMensual").modal("show");
        } else {
          setTimeout(function() {
            this_aux.showErrorSucces(DatosJSON);
          }, 500);
        }
        setTimeout(function() {
          $("#_modal_please_wait").modal("hide");
        }, 500);
      },
      function(error) {
        setTimeout(function() {
          this_aux.showErrorPromise(error);
        }, 500);
      }
    );
  }

  showErrorPromise(error) {
    console.log(error);
    // tslint:disable-next-line:max-line-length
    document.getElementById('mnsError').innerHTML =   "El servicio no esta disponible, favor de intentar mas tarde";
    $('#_modal_please_wait').modal('hide');
    $('#errorModal').modal('show');
  }

  showErrorPromiseMoney(json) {
    if (json.errorCode === 'API_INVOCATION_FAILURE') {
      $('#errorModal').modal('show'); 
      document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
    } else {
      document.getElementById('msgError').innerHTML =   "No fue posible confirmar la operación. Por favor verifica tu saldo.";
      $('#ModalErrorTransaccion').modal('show');
    }
  }

  showErrorSucces(json) {
    console.log(json.Id + json.MensajeAUsuario);
    if (json.Id === "2") {
      document.getElementById("mnsError").innerHTML =
        "El servicio no esta disponible, favor de intentar mas tarde";
    } else {
      document.getElementById("mnsError").innerHTML = json.MensajeAUsuario;
    }
    $('#_modal_please_wait').modal('hide');
    $("#errorModal").modal("show");
  }
}
